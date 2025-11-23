<template>
    <div class="header">
        <header>
            <div class="navigation">
            <nav>
                <router-link to="/main">Главная</router-link>
                <router-link to="/source">Источники данных</router-link>
                <router-link to="/dashboard">Дашборды</router-link>
            </nav>
            </div>
        </header>
    </div>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <router-view />
    </div>
    <div class="footer">
        <footer>
            
        </footer>
    </div>
</template>