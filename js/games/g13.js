// ============ Juegos hechos aparte, incrustados en el feed (carpeta ext/) ============
def({id:'palabros',title:'PALABROS',emoji:'🔤',tag:'palabras',hint:'',style:'ink-night',skin:'flat',
colors:['#202c40','#202c40','#6a97f4'],font:"'Fredoka',sans-serif",embed:'ext/palabros/index.html'});
def({id:'gatodoku',title:'GATODOKU',emoji:'🐱',tag:'gatos lógicos',hint:'',style:'pastel-cat',skin:'light flat',
colors:['#dfe3ff','#cfd4f5','#6f8cff'],font:"'Fredoka',sans-serif",embed:()=>'ext/gatodoku/index.html#gato/'+(1+Math.floor(Math.random()*24))});
def({id:'dojo',title:'DOJO GAMBERRO',emoji:'🥋',tag:'cartas samurái',hint:'',style:'pixel-dojo',skin:'flat',
colors:['#14122b','#14122b','#ffcf3a'],font:"'Press Start 2P',monospace",embed:'ext/dojo/index.html'});
def({id:'shobu',title:'SHOBU SUMO',emoji:'🤼',tag:'sumo 8 bits',hint:'',style:'pixel-sumo',skin:'flat',
colors:['#14122b','#14122b','#ff5a5a'],font:"'Press Start 2P',monospace",embed:'ext/shobu/index.html'});
def({id:'laserinto',title:'LASERINTO',emoji:'🔦',tag:'láser y espejos',hint:'',style:'neon3d',skin:'flat',
colors:['#1a1840','#1a1840','#ff4d6d'],font:"'Fredoka',sans-serif",embed:'ext/laserinto/index.html'});
def({id:'nexo',title:'NEXO',emoji:'➕',tag:'caminos de sumas',hint:'',style:'ink-green',skin:'flat',
colors:['#192231','#192231','#0ec477'],font:"'Fredoka',sans-serif",embed:'ext/nexo/index.html'});
