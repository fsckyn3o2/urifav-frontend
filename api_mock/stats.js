
const stats = {
    calls: 0,
    postCalls: 0,
    getCalls: 0,
    putCalls: 0,
    lastCall: null,
    newCall: (req) => {
        stats.lastCall = new Date();
        stats.calls++;
        console.log(stats.lastCall.toISOString() + ' : ' + req.method + ' : ' + req.url);
    },
    newGetCall: (req) => {
        stats.newCall(req);
        stats.getCalls++;
    },
    newPostCall: (req) => {
        stats.newCall(req);
        stats.postCalls++;
    },
    newPutCall: (req) => {
        stats.newCall(req);
        stats.putCalls++;
    },
    html: () => {
        return `<style>
                        table tr th {
                            text-align: right; 
                            padding-right: 1.4em;
                        }
                </style>
                <table>
                <tr>
                    <th>Calls</th>
                    <td>${stats.calls}</td>
                </tr>
                <tr>
                    <th>Last call</th>
                    <td>${stats.lastCall}</td>
                </tr>
            </table>`;
    }
}

module.exports.stats = function() {
    return stats;
}
