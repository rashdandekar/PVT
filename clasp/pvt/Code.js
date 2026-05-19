function doGet(e) {
  var template=HtmlService.createTemplateFromFile('index');
  return template.evaluate()
          .setTitle('Oil and Gas PVT Properties')
          .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
