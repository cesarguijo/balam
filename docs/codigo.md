## Members

<dl>
<dt><a href="#avisoInstalacion">avisoInstalacion</a> : <code>Event</code> | <code>null</code></dt>
<dd><p>El aviso de instalación que ofrece el navegador, guardado para mostrarlo
cuando el usuario toque &quot;Instalar&quot;. Es null mientras no haya aviso.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#rutas">rutas</a> : <code>Record.&lt;string, Pantalla&gt;</code></dt>
<dd><p>Tabla de rutas de la aplicación: relaciona cada ruta con la función que
muestra su pantalla. Para agregar una pantalla nueva:</p>
<ol>
<li>Importa la función de la pantalla.</li>
<li>Agrega una línea con la forma <code>&#39;#/ruta&#39;: mostrarPantalla,</code>.</li>
</ol>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#navegar">navegar()</a></dt>
<dd><p>Muestra la pantalla que corresponde a la ruta actual; si la ruta no
existe, muestra la de inicio.</p>
</dd>
<dt><a href="#esperar">esperar(ms)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Pausa el código durante el tiempo indicado.</p>
</dd>
<dt><a href="#mostrarBienvenida">mostrarBienvenida(app)</a></dt>
<dd><p>Muestra la pantalla de bienvenida dentro del contenedor.</p>
</dd>
<dt><a href="#mostrarCatalogo">mostrarCatalogo(app)</a></dt>
<dd><p>Muestra la pantalla catálogo dentro del contenedor.</p>
</dd>
<dt><a href="#mostrarInicio">mostrarInicio(app)</a></dt>
<dd><p>Muestra la pantalla de inicio dentro del contenedor.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Pantalla">Pantalla</a> ⇒ <code>void</code></dt>
<dd><p>Una pantalla de la app: recibe el contenedor y dibuja su contenido dentro.</p>
</dd>
</dl>

<a name="avisoInstalacion"></a>

## avisoInstalacion : <code>Event</code> \| <code>null</code>
El aviso de instalación que ofrece el navegador, guardado para mostrarlocuando el usuario toque "Instalar". Es null mientras no haya aviso.

**Kind**: global variable  
<a name="rutas"></a>

## rutas : <code>Record.&lt;string, Pantalla&gt;</code>
Tabla de rutas de la aplicación: relaciona cada ruta con la función quemuestra su pantalla. Para agregar una pantalla nueva:1. Importa la función de la pantalla.2. Agrega una línea con la forma `'#/ruta': mostrarPantalla,`.

**Kind**: global constant  
<a name="navegar"></a>

## navegar()
Muestra la pantalla que corresponde a la ruta actual; si la ruta noexiste, muestra la de inicio.

**Kind**: global function  
**Throws**:

- <code>Error</code> Si no existe el contenedor #app en index.html.

<a name="esperar"></a>

## esperar(ms) ⇒ <code>Promise.&lt;void&gt;</code>
Pausa el código durante el tiempo indicado.

**Kind**: global function  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promesa que avisa cuando termina la espera.  

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>number</code> | Tiempo de espera en milisegundos. |

<a name="mostrarBienvenida"></a>

## mostrarBienvenida(app)
Muestra la pantalla de bienvenida dentro del contenedor.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>HTMLElement</code> | Contenedor donde se dibuja la pantalla. |

<a name="mostrarCatalogo"></a>

## mostrarCatalogo(app)
Muestra la pantalla catálogo dentro del contenedor.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>HTMLElement</code> | Contenedor donde se dibuja la pantalla. |

<a name="mostrarInicio"></a>

## mostrarInicio(app)
Muestra la pantalla de inicio dentro del contenedor.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>HTMLElement</code> | Contenedor donde se dibuja la pantalla. |

<a name="Pantalla"></a>

## Pantalla ⇒ <code>void</code>
Una pantalla de la app: recibe el contenedor y dibuja su contenido dentro.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>HTMLElement</code> | Contenedor donde se dibuja la pantalla. |

