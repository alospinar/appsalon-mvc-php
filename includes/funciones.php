<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function esUltimo(string $actual, string $proximo):bool {
    if($actual!==$proximo){
        return true;
    }
    return false;
}

//revisar que el usuario este autenticado

function isAuth(): void {
    if(!isset($_SESSION['login'])){
        header('location: /');
    }
}
function isSession() : void {
    if(!isset($_SESSION)) {
        session_start();
    }
}

function isAdmin() : void {
    if(!isset($_SESSION['admin'])){
        header('location: /');
    }
}