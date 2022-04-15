function errorHandle(res) {
    const headers = {
        'Access-Control-Allow-Headers': 'Content"ype, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
        "Content-Type": "application/json"
    }
    res.writeHead( 400, headers);
    res.write(JSON.stringify({
        "status": "false",
        "message": "欄位未填寫正確，或無此 id"
    }));
    res.end();
}

module.exports = errorHandle;