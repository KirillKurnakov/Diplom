<template>
    <div class="header">
        <header>
            <div class="navigation">
            <nav>
                <router-link to="/main">Главная</router-link>
                <router-link to="/main/sourcepage">ПФХД</router-link>
                <router-link to="/main/fkform">737 форма</router-link>
                <router-link to="/main/protocols">Протоколы</router-link>
                <router-link to="/main/dashboard">Дашборды</router-link>
                <router-link to="/main/spravkigigit ">Справки</router-link>
                <router-link style="margin-left: 80rem;" to="/">Выйти</router-link>
            </nav>
            </div>
        </header>
    </div>
        <div>
            <div style="display: flex;">
            <h1 style="margin-top: 14rem; margin-left:3rem">Для работы с определенным разделом информационной системы ПроАнализ выберите нужный пункт из верхнего меню</h1>
            <img class="logo1" style="margin-top: 10rem; text-align: left;" src="../img/logomainpng.png"></img>
            </div>
            <router-view />
        </div>
    <div class="footer">
        <footer>
            
        </footer>
    </div>
</template>