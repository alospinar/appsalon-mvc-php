<h1 class="nombre-pagina">olvide password</h1>
<p class="descripcion-pagina">Reestrablece tu password escribiendo tu email a continuacion</p>
<?php
    include_once __DIR__.'/../templates/alertas.php';
?>
<form class="formulario" action="/olvide" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input 
            type="email"
            id="email"
            name="email"
            placeholder="Tu Email"
        />
    </div>

    <input type="submit" class="boton" value="Enviar Instrucciones">
</form>

<div class="acciones">
    <a href="/">Ya tienes una cuenta? inicia sesion</a>
    <a href="/crear-cuenta">Aun no tiene una cuenta? crear cuenta</a>

</div>