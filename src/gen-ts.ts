// Requires node >= 7.6

import {generate} from 'escodegen';
import {Analyzer, Element, ElementMixin, Feature, FSUrlLoader, Method, Package, PackageUrlResolver, Property} from 'polymer-analyzer';
import {Function as ResolvedFunction} from 'polymer-analyzer/lib/javascript/function';

import {genDatabindingCode} from './gen-databinding';

const isInTestsRegex = /(\b|\/|\\)(test)(\/|\\)/;
const isTest = (f: Feature) =>
    f.sourceRange && isInTestsRegex.test(f.sourceRange.file);

// const declarationKinds = ['element', 'element-mixin', 'namespace',
// 'function']; const isDeclaration = (f: Feature) =>
// declarationKinds.some((kind) => f.kinds.has(kind));

const header = `declare namespace Polymer {
  type Constructor<T> = new(...args: any[]) => T;
`;
const footer = `}`;

export async function generateDeclarations(dir?: string) {
  const analyzer = new Analyzer({
    urlLoader: new FSUrlLoader(dir),
    urlResolver: new PackageUrlResolver(),
  });

  const pkg = await analyzer.analyzePackage();
  process.stdout.write(generatePackage(pkg));
}

export function generatePackage(pkg: Package): string {
  const declarations = [header];

  for (const feature of pkg.getFeatures()) {
    // if (feature.sourceRange == null) {
    //   continue;
    // }
    if (isTest(feature)) {
      continue;
    }

    if (feature.kinds.has('element')) {
      genElementDeclaration(feature as Element, declarations, 2);
    } else if (feature.kinds.has('element-mixin')) {
      genMixinDeclaration(feature as ElementMixin, declarations, 2);
    } else if (feature.kinds.has('namespace')) {
      // genNamespaceDeclaration(feature, declarations);
    } else if (feature.kinds.has('function')) {
      genFunctionDeclaration(feature as ResolvedFunction, declarations, 2);
    }
  }

  declarations.push(footer);
  return declarations.join('\n');
}

export function generateDatabindingCode(pkg: Package): string {
  const databindingCode: string[] = ['if (!!false) {'];
  for (const polymerElem of pkg.getByKind('polymer-element')) {
    genDatabindingCode(polymerElem, databindingCode, pkg);
  }
  databindingCode.push('}');
  return databindingCode.join('\n\n') + '\n';
}

function genElementDeclaration(
    element: Element, declarations: string[], indent: number = 0) {
  if (!element.className) {
    // TODO: handle elements with tagname, but no exported class
    return;
  }
  const {name: className, namespace: namespaceName} =
      getNamespaceAndName(element.className);
  if (namespaceName !== 'Polymer') {
    // TODO: handle non-Polymer namespaces
    return;
  }

  const node = element.astNode;
  let d = '';

  if (node == null) {
    process.stderr.write(`no AST node for ${element.className}\n`);
    d += `${idt(indent)}class ${className} {\n`;
  } else if (
      node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
    d += `${idt(indent)}class ${
                                node.id!.name
                              } extends ${generate(node.superClass)} {\n`;
  } else if (node.type === 'VariableDeclaration') {
    // We can't output the variable initializer, so we union the mixins
    let supers: string[] = [];
    if (element.superClass) {
      const superName =
          getNamespaceAndName(element.superClass.identifier).name!;
      supers.push(superName)
    }
    for (const mixin of element.mixins) {
      const mixinName = getNamespaceAndName(mixin.identifier).name!;
      supers.push(mixinName)
    }
    const type = supers.map((s) => `Constructor<${s}>`).join('&');

    d += `${idt(indent)}const ${className}: ${type};\n`;
    declarations.push(d);
    return;
  } else {
    process.stderr.write(`no AST node for ${element.className}\n`);
    d += `${idt(indent)}class ${className} {\n`;
  }

  for (const property of element.properties) {
    if (property.privacy === 'private' || property.inheritedFrom != null) {
      continue;
    }
    d += `${idt(indent)}  ${
                            getVisibility(property)
                          }${property.name}${
                                             getTypeAnnotation(property, true)
                                           };\n`;
  }

  for (const method of element.methods) {
    const methodText = genMethod(method, indent + 2);
    if (methodText) {
      d += methodText;
    }
  }

  d += `${idt(indent)}}\n`;
  declarations.push(d);
}

function genMixinDeclaration(
    mixin: ElementMixin, declarations: string[], indent: number = 0) {
  const {name, namespace: namespaceName} = getNamespaceAndName(mixin.name);
  if (namespaceName !== 'Polymer') {
    // TODO: handle non-Polymer namespaces
    return;
  }

  let d = '';

  const extendsText = (mixin.mixins && mixin.mixins.length > 0) ? 'extends ' +
          mixin.mixins.map((m) => getNamespaceAndName(m.identifier).name)
              .join(', ') :
                                                                  '';

  d += `${idt(indent)}interface ${name} ${extendsText}{\n`

  for (const property of mixin.properties) {
    const propertyText = genProperty(property, indent + 2);
    if (propertyText) {
      d += propertyText;
    }
  }

  for (const method of mixin.methods) {
    const methodText = genMethod(method, indent + 2);
    if (methodText) {
      d += methodText;
    }
  }

  d += `${idt(indent)}}\n`;
  d +=
      `${
         idt(indent)
       }const ${
                name
              }: <T extends Constructor<HTMLElement>>(base: T) => T & Constructor<${
                                                                                    name
                                                                                  }>;\n`;
  declarations.push(d);
}

function genFunctionDeclaration(
    func: ResolvedFunction, declarations: string[], indent: number = 0) {
  if (func.privacy === 'private') {
    return;
  }
  const {namespace: namespaceName} = getNamespaceAndName(func.name);
  if (namespaceName !== 'Polymer') {
    // TODO: handle non-Polymer namespaces
    return;
  }
  declarations.push(genMethod(func, indent)!);
  // const paramText = func.params
  //   ? func.params.map(genParameter).join(', ')
  //   : '';
  // declarations.push(`${idt(indent)}function
  // ${name}(${paramText})${getTypeAnnotation(func.return)};\n`);
}

const idt = (indent: number = 0) => ' '.repeat(indent);

/**
 * Property
 *
 * @param property
 * @param indent
 */
function genProperty(property: Property, indent: number): string|undefined {
  if (property.privacy === 'private' || property.inheritedFrom != null) {
    return;
  }
  return `${idt(indent)}${
                          getVisibility(property)
                        }${property.name}${
                                           getTypeAnnotation(property, true)
                                         };\n`;
}

/**
 * Method
 *
 * @param method
 * @param indent
 */
function genMethod(method: Method, indent: number): string|undefined {
  if (method.privacy === 'private' || method.inheritedFrom != null) {
    return;
  }
  const returnType = method.return && getTsType(method.return.type);
  const returnTypeText = (returnType && returnType.type) || 'any';
  const paramText =
      method.params ? method.params.map(genParameter).join(', ') : '';
  return `${idt(indent)}${
                          getVisibility(method)
                        }${method.name}(${paramText}): ${returnTypeText};\n`;
}

/**
 * Parameter
 *
 * @param parameter
 */
function genParameter(parameter: {name: string; type?: string;}) {
  const {type, optional} = getTsType(parameter.type);
  return `${parameter.name}${optional ? '?' : ''}: ${type}`;
}


function getVisibility(property: Property) {
  // `protected` is not allowed on interfaces :(
  if (property.privacy == null || property.privacy === 'public' ||
      property.privacy === 'protected') {
    return '';
  }
  return property.privacy + ' ';
}

function getTypeAnnotation(
    hasType?: {type?: string, name?: string}, defaultAny: boolean = false) {
  if (hasType &&
      (hasType.name && hasType.name.startsWith('...') ||
       hasType.type === 'Array')) {
    return `: any[]`;
  }
  let type = defaultAny ? 'any' : null;
  if (hasType && hasType.type) {
    type = hasType.type;
  }
  return type ? `: ${getTsType(type)}` : '';
}

const typeMap = new Map([
  ['function', 'Function'],
  ['String', 'string'],
  ['Number', 'number'],
  ['Boolean', 'boolean'],
  ['Array', 'any[]'],
]);

interface TsType {
  type: string, optional: boolean;
}

function getTsType(type?: string): TsType {
  let optional = false;

  // default to 'any'
  type = type || 'any';

  // handle Closure optionals
  if (type.endsWith('=')) {
    optional = true;
    type = type.substring(0, type.length - 1);
  }

  // convert from Closure
  if (typeMap.has(type)) {
    type = typeMap.get(type)!;
  }
  return {type, optional};
}

function getNamespaceAndName(name: string):
    {name?: string, namespace?: string} {
  if (typeof name === 'string') {
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return {
        name: name.substring(lastDotIndex + 1, name.length),
        namespace: name.substring(0, lastDotIndex)
      };
    }
  }
  return {name};
}
