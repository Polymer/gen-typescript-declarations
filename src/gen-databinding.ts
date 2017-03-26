import * as dom5 from 'dom5';
import * as estree from 'estree';
import * as parse5 from 'parse5';
import {AttributeDatabindingExpression, Package, PolymerDatabindingExpression, PolymerElement} from 'polymer-analyzer';

import {Result} from './result';

export function genDatabindingCode(
    feature: PolymerElement, databindingCode: string[], pkg: Package) {
  if (!feature.tagName) {
    return;
  }
  const domModules = pkg.getById('dom-module', feature.tagName);
  if (domModules.size !== 1) {
    return;
  }
  const elemDatabindingLines = ['  {'];
  const localElemName = kebabToCamel(feature.tagName);
  elemDatabindingLines.push(
      `    const ${
                   localElemName
                 } = document.createElement(${
                                              JSON.stringify(feature.tagName)
                                            });`);
  const domModule = domModules.values().next().value!;

  const attributeBindingsByElement =
      new Map<parse5.ASTNode, AttributeDatabindingExpression[]>();
  for (const databinding of domModule.databindings) {
    if (!(databinding instanceof AttributeDatabindingExpression)) {
      continue;
    }
    let exprs = attributeBindingsByElement.get(databinding.astNode) || [];
    exprs.push(databinding);
    attributeBindingsByElement.set(databinding.astNode, exprs);
  }

  for (const [otherElem, bindings] of attributeBindingsByElement) {
    if (!otherElem.tagName) {
      continue;
    }

    const otherTag = dom5.getAttribute(otherElem, 'is') || otherElem.tagName;
    const fakeTag =
        feature.tagName === otherTag ? `other-${otherTag}` : otherTag;
    const otherElemIdent = kebabToCamel(fakeTag);
    const elemLines = [
      `    {`,
      `      const ${
                     otherElemIdent
                   } = document.createElement(${JSON.stringify(otherTag)});`
    ];
    for (const binding of bindings) {
      const astResult = getAstFromDatabinding(binding);
      if (!astResult.successful) {
        continue;
      }
      const ast = astResult.value;
      const astExpression =
          astToExpression(ast, localElemName).unwrapOr(undefined);
      if (!astExpression) {
        continue;
      }

      if (binding.isCompleteBinding && !binding.attribute.name.endsWith('$')) {
        const otherPropertyName =
            binding.attribute.name.replace(/-./g, (s) => s[1].toUpperCase());
        {
          const lineNum = binding.sourceRange.start.line + 1;
          const file = binding.sourceRange.file;
          // TODO(rictic): It'd probably be more helpful to mention the line
          //     and file at the opening of the otherElem block rather than
          //     for each expression...
          elemLines.push(
              `      // Databinding expression on line ${lineNum} of ${file}`);
        }
        const otherExpression = `${otherElemIdent}.${otherPropertyName}`;
        elemLines.push(`      ${otherExpression} = ${astExpression};`);
        if (binding.direction === '{' && isAssignable(ast)) {
          elemLines.push(`      ${astExpression} = ${otherExpression};`);
        }
      }
    }
    elemLines.push(`    }`);
    if (elemLines.length > 3) {
      elemDatabindingLines.push(...elemLines);
    }
  }

  for (const databinding of domModule.databindings) {
    const ast = getAstFromDatabinding(databinding);
    if (!ast) {
      continue;
    }
    if (databinding instanceof AttributeDatabindingExpression) {
      const otherTagName = databinding.astNode.tagName;
      if (!otherTagName) {
        continue;
      }
    }
  }
  elemDatabindingLines.push('  }');
  elemDatabindingLines.push('');
  databindingCode.push(elemDatabindingLines.join('\n'));
}


function getAstFromDatabinding(databinding: PolymerDatabindingExpression):
    Result<estree.Program, undefined> {
  if (databinding && databinding['_expressionAst'] &&
      databinding['_expressionAst'].type === 'Program') {
    return Result.succeed(databinding['_expressionAst']);
  }
  return Result.fail(undefined);
}

function astToExpression(
    ast: estree.Node, localElemIdent: string): Result<string, undefined> {
  switch (ast.type) {
    case 'UnaryExpression':
      return astToExpression(ast.argument, localElemIdent)
          .map(v => `${ast.operator}${v}`);
    case 'CallExpression':
      return astToExpression(ast.callee, localElemIdent).andThen(callee => {
        return Result
            .all(ast.arguments.map(arg => astToExpression(arg, localElemIdent)))
            .map(argVals => `${callee}(${argVals.join(', ')})`);
      });
    case 'Identifier':
      return Result.succeed(`${localElemIdent}.${ast.name}`);
    case 'MemberExpression':
      const pieces: string[] = [];
      let current: estree.Node = ast;
      while (current.type === 'MemberExpression') {
        if (current.computed || current.property.type !== 'Identifier') {
          return Result.fail(undefined);
        }
        pieces.unshift(current.property.name);
        current = current.object;
      }
      return astToExpression(current, localElemIdent).map((obj) => {
        pieces.unshift(obj);
        return pieces.join('.');
      });
    case 'Program':
      return Result.all(ast.body.map(b => astToExpression(b, localElemIdent)))
          .map(lines => lines.join('\n'));
    case 'ExpressionStatement':
      return astToExpression(ast.expression, localElemIdent);
    case 'Literal':
      return Result.succeed(ast.raw);
    default:
      console.log(`could not handle expression type: ${ast.type}`)
  }
  return Result.fail(undefined);
}

function isAssignable(program: estree.Program) {
  if (program.body.length !== 1) {
    return false;
  }
  const statement = program.body[0]!;
  if (statement.type !== 'ExpressionStatement') {
    return false;
  }
  return isExprAssignable(statement.expression);
}

function isExprAssignable(expr: estree.Expression|estree.Super): boolean {
  switch (expr.type) {
    case 'Identifier':
      return true;
    case 'MemberExpression':
      return isExprAssignable(expr.object);
  }
  return false;
}

function kebabToCamel(kebabStr: string): string {
  return kebabStr.replace(/-./g, (s) => s[1].toUpperCase());
}
