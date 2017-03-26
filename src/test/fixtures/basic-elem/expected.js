if (!!false) {

  {
    const basicElem = document.createElement("basic-elem");
    {
      const div = document.createElement("div");
      // Databinding expression on line 4 of basic-elem.html
      div.id = basicElem.writeOnly;
    }
    {
      const div = document.createElement("div");
      // Databinding expression on line 5 of basic-elem.html
      div.id = basicElem.readWrite;
      basicElem.readWrite = div.id;
    }
    {
      const div = document.createElement("div");
      // Databinding expression on line 6 of basic-elem.html
      div.id = basicElem.readWriteCall();
    }
    {
      const div = document.createElement("div");
      // Databinding expression on line 7 of basic-elem.html
      div.id = basicElem.callWithArgs(basicElem.arg1, basicElem.arg2);
    }
    {
      const div = document.createElement("div");
      // Databinding expression on line 8 of basic-elem.html
      div.id = basicElem.callWithLiteralArg(basicElem.arg1, 10);
    }
    {
      const customElem = document.createElement("custom-elem");
      // Databinding expression on line 10 of basic-elem.html
      customElem.propOne = basicElem.foo;
      basicElem.foo = customElem.propOne;
      // Databinding expression on line 10 of basic-elem.html
      customElem.propTwo = basicElem.bar;
      basicElem.bar = customElem.propTwo;
    }
  }


}
