const leaderboard = Vue.component('leaderboard', {
    props: ['players'],
    template: `
        <div class="leaderboardWrapper">
            <div class="leaderboard elevation-8" dense>
                <div class="headers pt-2 pb-2 pl-4 pr-4">
                    <span class="overline pl-2">ID</span>
                    <span class="overline">Player Name(s)</span>
                    <span class="overline">Distance</span>
                    <span class="overline pr-2">Ping</span>
                </div>
                <div class="content pl-4 pr-4">
                    <div v-for="(player, index) in players" :key="index" class="section">
                        <div class="overline">{{ player.id }}</div>
                        <div>{{ player.name }}</div>
                        <div class="overline">{{ player.distance.toFixed(2) }}</div>
                        <div class="overline"><v-icon>icon-wifi</v-icon> {{ player.ping }}ms</div>
                    </div>
                </div>
            </div>
        </div>    
        `
});
