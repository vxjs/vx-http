<!DOCTYPE html>
<html>
<head>
  <title>Routes</title>
</head>
<body>
  <h1>vx-http: registered namespace handlers</h1>

  <ul>
    {{#namespaces}}
    <li><a href="/{{route}}">/{{route}}</a> ({{handlersCount}})</li>
    {{/namespaces}}
  </ul>
</body>
</html>
