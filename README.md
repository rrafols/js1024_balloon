# js1024 2020 Entry - Balloon

1k JavaScript 2D Canvas entry for https://js1024.fun 2020 competition.

![animated gif preview](./img/js1024_square.gif)

# Inspiration
I stumbled upon the three.js ballooning demo by https://twitter.com/alexanderperrin and wanted to recreate something similar with just 1k (and without external libraries and resources).

Ballooning demo: https://alexanderperrin.com.au/triangles/ballooning/

# Tooling
Minified and packed using Terser & RegPack https://xem.github.io/terser-online

Using the following options on RegPack to achieve the 1024 bytes limit.

```javascript
{
  withMath: false,
  hash2DContext: true,
  hashWebGLContext: true,
  hashAudioContext: true,
  contextVariableName: "c",
  contextType: 0,
  reassignVars: true,
  varsNotReassigned: "a b c d", // js1024
  crushGainFactor: 8,
  crushLengthFactor: 18,
  crushCopiesFactor: 20,
  crushTiebreakerFactor: 1,
  wrapInSetInterval: false,
  timeVariableName: "t",
  useES6: true
}
```
