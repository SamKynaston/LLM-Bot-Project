module.exports = {
    name: "ClientReady",
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
    },
};