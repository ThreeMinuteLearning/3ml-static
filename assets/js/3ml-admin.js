var app = Elm.Main.init({flags: navigator.userAgent});

app.ports.elmToVega.subscribe(function(vlSpec) {
    window.requestAnimationFrame(function() {
        vegaEmbed("#vis", vlSpec, {actions: false, renderer: 'svg', ast: true }).catch(console.warn);
    });
});
