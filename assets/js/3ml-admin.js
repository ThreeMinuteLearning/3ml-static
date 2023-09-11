var app = Elm.Main.init({flags: navigator.userAgent});

app.ports.elmToVega.subscribe(function(vlSpec) {
    var vgSpec = vegaLite.compile(vlSpec, {}).spec;
    var runtimeSpec = vega.parse(vgSpec, null, { ast: true });

    window.requestAnimationFrame(function() {
        var view = new vega.View(runtimeSpec, {
          expr:      vega.expressionInterpreter,
          renderer:  'svg',
          container: '#vis',
          hover:     false
        });

        view.runAsync();
        // vegaEmbed("#vis", spec, {actions: false, renderer: 'svg'}).catch(console.warn);
    });
});
