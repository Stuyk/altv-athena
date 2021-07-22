const leaderboard = Vue.component('leaderboard', {
    props: ['players'],
    template: `
        <div class="leaderboardWrapper">
            <div class="leaderboard elevation-8" dense>
                <div class="headers pt-2 pb-2 pl-4 pr-6">
                    <span class="overline">ID</span>
                    <span class="overline">Player Name(s)</span>
                    <span class="overline ping">Ping</span>
                </div>
                <div class="content">
                    <div v-for="(player, index) in players" :key="index" class="section pl-4 pr-4">
                        <div>{{ player.id }}</div>
                        <div>{{ player.name }}</div>
                        <div class="ping">{{ player.ping }}ms</div>
                    </div>
                </div>
            </div>
        </div>    
        `
});
