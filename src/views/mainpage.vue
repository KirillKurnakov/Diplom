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
            </nav>
            </div>
        </header>
    </div>
    <div>
        <router-view />
    </div>
    <div class="footer">
        <footer>
            
        </footer>
    </div>
</template>