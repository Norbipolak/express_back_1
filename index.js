/*
    Mindig azzal kell kezdeni, hogy npm init a terminálba!!!

    Ott majd a terminálba ki lehet választani olyan dolgokat, hogy package name 
    de ezeket nem fontos és akkor vannak még egyább dolgok, de ezeket lehet majd üresen hagyni 
    pl. 
    description:
    entry point: (index.js)
    test command:
    git repository: 
    keywords: 
    author:
    stb. 

    És ilyenkor ha ez meg van, akkor kapunk egy package.json file-t!!!!!!!!!!!!!!!!!!!!!!!

    Ezen kivül két dolgot kell majd installálni -> npm i express mysql2 
        és ezeket lehet így szóközzel elválasztva írni, ha több dolgot akarunk egyszerre feltelepíteni az npm i-vel!!!! 

    amit itt elöször kell csinálni mindig, hogy a mysql-t be kell importálni! 
*/
import mysql from "mysql2";

/*
    Ha ez be van importálva, akkor csinálhatjuk a createConnection-ös dolgot 
*/

const conn = mysql.createConnection({
    host: "127.0.0.1",
    database: "vitorlasberles",
    user: "root", 
    password: ""
});

/*
    És ahhoz, hogy ezt a promise-t használjuk, ennek is van egy then és egy catch ága/metódusa!! 
    conn.promise().query()
    Ez a különbség, hogy elötte itt van egy promise()
    tehát nem ez a megoladás, ahol majd kell a callback function 
    ->
    conn.query("SELECT * FROM hajo WHERE tipus = 'Kalóz'", (data, err)=> {if(err) console.log("err ", err);return;});

    Az adja meg azt az objeltumot, amiből a query() metódus lesz meghívva 
    conn.promise().query()
    és akkor ennek vagy egy then() metódusa meg egy catch() is 

    conn.promise().query().then((data)=>{console.log(data)})

    De ez még mindig ilyen callback function-ös megoldás -> then((data)=>{console.log(data)
*/

/*
    nagyon fontos, hogy el legyen indítva a WAMP server és utána kell azt írni a terminálba, hogy 
    nodemon index!!!! 

    és ami még nagyon fontos, hogy be legyen állítva a package.json-nél, hogy "type": "module"!!!!! 
    Tehát az így nézzen ki 
    {
        "name": "third-lesson",
        "version": "1.0.0", 
        "description": "", 
        "main": "index.js", 
        "type": "module" -> ezt kell majd nekünk itt hozzáadni 
        "scripts": {
            "test": "echo \"Error: no test specified"\ && exit1"
        },
        "author": "", 
        "license": "ISC", 
        "dependencies": {
            "express": "4.21.0",
            "mysql2": "3.11.2"
        }
    }
*/

/*
    fontos, hogy be legyen az SQL query, tehát a query()-ben be legyen írva, hogy mit akarunk lehozni vagy felvinni
    ->
*/
conn.promise().query("SELECT * FROM hajo LIMIT 5").then((data)=>{
    console.log(data)
});

/*
    Ez is egy megoldás, csak itt még kell majd egy catch ág is, ha valamit elrontanánk 
*/

conn.promise().query("select * from hajo").then((data)=> {
    console.log(data);
}).catch((err)=> {
    console.log(err);
});

/*
    Azért kell majd a catch ág, mert ha itt valamit elötte elrontanánk pl. a hajo helyett azt íránk be, hogy hajok 
    query("select * from hajok")
    Akkor itt kapunk egy hibaüzenetet, hogy vitorlasberles.hajok doesn't exist
    De ha viszont nem lenne itt ez a catch ág, akkor leállna az egész kód futása!!! 
*/

/*
    De ezt úgy kell megcsinálni, hogy az egész egy async function legyen!!!!! 

    Mivel ez egy async, ezért kell, hogy legyen egy await-es dolog 
    const response = await conn.promise().query("select * from hajo");
*/

async function getShips() {
    const response = await conn.promise().query("select * from hajo limit 5");
    console.log(response);
};

//és ha meghívjuk a függvényt, akkor lejönnek ezek az adatok 
getShips();

/*
    [
        {
            regiszter: 1, 
            nev: 'HUN-20',
            tipus: 'Kalóz',
            utas: 2, 
            dij: 7500
        },
        ... és akkor még lejön 4 ilyen objektum ugyanezekkel a mezőkkel, csak más adatokkal, mint, ahogy az sql-ben meg van csinálva!!! 
    ]

    ezzen kivül még le is hozza a mezőket 
    {
        'regiszter' INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        'nev' VARCHAR(12),
        'tipus' VARCHAR(12),
        'utas' INT NOT NULL
        'dij' INT NOT NULL
    }
    de csak azért az összes mezőt, mert a lekérdezésben ez volt "select * from hajo limit 5"
    ha mondjuk ez lenne, hogy "select nev from hajo"
    akkor csak ez jönne majd le 
    'nev' VARCHAR(12)
    meg ugye az adatoknál is csak ez a része, hogy -> nev: 'HUN-20',
*/

async function getShips2() {
    const response = await conn.promise().query("SELECT regiszter, nev FROM hajo LIMIT 5");
    console.log(response);
}

/*
    És ilyenkor csak a név meg a regiszter fog megjelenni, tehát olyan formában, hogy ez a response két tömböt tartalmaz majd 
    1. itt vannak majd az adatok amik lejöttek, hogy regiszter 1 nev:'HUN-20'
    2. ebben a tömbben van az, hogy milyen mezők vannak és azoknak az értékei, hogy int vagy varchar

    így néz ki 

    [
        [
            { regiszter: 1, nev: 'HUN-20' },
            { regiszter: 2, nev: 'Pille' },
            { regiszter: 3, nev: 'Vihar' },
            { regiszter: 4, nev: 'Hableány' }
        ],
        [
            'regiszter' INT NOT NULL PRIMARY KEY AUTO_INREMENT,
            'nev': VARCHAR(12)
        ]
    ]
    
    Tehát van egy tömb, amiben van két tömb és abban vannak majd az objektumok, amik tartalmazzák ezeket az adatokat és majd ha hivatkozni 
    akarunk arra amiben vannak a rendes adatok, akkor [0] kell majd, mert az első tömbben lesznek majd az adatok, amivel dolgozni szeretnénk  
*/ 

/*
    De ezzel megint van egy kis probléma, mert mi van ha rosszul írjuk be mondjuk a tábla nevét 
    ("SELECT regiszter, nev FROM hajo LIMIT 5");
    -> nem hajo, hanem hajok 
    "SELECT regiszter, nev FROM hajok LIMIT 5");

    és akkor kapunk egy ilyen hibaüzenetet, hogy 
    Table 'vitorlasberles.hajok' doesn't exist és ebben az esetben le fog állni az egész kód, mert nincs, ami majd kezelje a hibát 

    Erre a megoldás a try-catch blokk!!!!!!!!!!!!!!
    -> 
*/ 

async function getShips3() {
    try {
        const response = await conn.promise().query("select * from hajok limit 5");
        console.log(response);
    } catch(err) {
        console.log(err);
    };
};

/*
    Ilyenkor ha elrontottunk valamit pl. hajok táblából akarunk megszerezni valami adatot, ami nem is létezik, akkor ha betettük egy try-catch
    blokkba akkor nem fog leállni a kód futása!
*/

/*
    Ez volt a lekérdezés és ha fel akarunk valamit vinni, akkor arra is csinálunk egy async function-t csak majd a query-ben egy insert lesz 
    nem egy select 
    -> 
*/ 

async function insertShip(data) {
    try {
         const response = await conn.promise().query(`insert into hajo 
            (nev, tipus, utas, dij)
            values(?,?,?,?)`,
            data)
    } catch(err) {
        console.log(err);
    };
};
/*
    A function vár egy data-t, amit majd megadunk neki meghíváskor és akkor ezzel majd reusable function lesz 
    ->
    async function insertShip(data) {

    } 
    - ez után meg try-catch blokkba 
    ->
    async function insertShip(data) {
    try {
         const response = await conn.promise().query(``)
    } catch(err) {

    };

    És fontos, hogy amit majd a query-ben írunk azt jobb hogyha `` (al gr 7-es) akkor tudunk majd ezzel sortörést csinálni 
    ha mondjuk túl hosszú a dolog, amit ide akarunk írni 
    ha ilyen van "" akkor kell valami \n ha sortörést akarunk 
    const response = await conn.promise().query(`insert into hajo 
        (nev, tipus, utas, dij)
        values(?,?,?,?)`,
        data)

    ez vár két dolgot 
    1. hogy milyen tipusú metódus, tehát itt insert, ha insert van, akkor fel kell sorolni egy ()-ben, hogy milyen mezőket akarunk majd megadni 
        és kell egy values() de azt nem itt adjuk meg, hanem annyi kérdőjelet csinálnuk, ahány mező van 
        `insert into hajo (nev, tipus, utas, dij) values(?,?,?,?)`
    2. itt adjuk meg, hogy mik lesznek majd ennek a mezőnek az értékei 
        itt kétféle módszer van 
        - megadjuk egy []-ben, hogy ["Vihar", "kalóz", 5, 8000] 
        - vagy mint itt, hogy reusable function legyen, vár majd egy data-t és majd meghíváskor fogjuk megadni az értékeket 
            de akkor majd ide kell beírni, hogy data, tehát amit vár a függvény, azt majd itt fogja megkapni/behelyetesíteni
        data 
        tehát ez lesz majd a második dolog, amit be kell írni egy query-ben ha egy insert-ről van szó 
*/

insertShip(["Mária", "kalóz", 5, 9000]);
/*
    itt fogjuk megadni amit vár a függvény, ezt a tömböt ami majd be lesz helyetsítve az insert-be 

    és ilyeneket fogunk majd kapni egy ResultSetHeader-ben 
    [
        ResultSetHeader {
            fieldCount: 0,
            affectedRows: 1,
            insertId: 42,
            info: '',
            serverStatus: 2,
            warningStatus: 0,
            changedRows: 0
        },
        undefined
    ]

    Ami nekünk itt fontos, hogy affectedRows meg az insertId 
    ha meg a warningStatus az nulla, akkor meg nincs gond, mert úgy is bementünk a catch ágba

    Mindegyik lekérdezés pontosan így néz ki, hogy conn.promise().query() csak attól függően, hogy mit írunk majd a query-be 
    -> 
    Ha mondjuk egy delete van, akkor meg nem egy data-t vár majd a függvény, hanem egy ID-t, amit majd be fogunk helyetesíteni 
    mint a data-t 
    -> 
    const response = await conn.promise().query(`insert into hajo (nev, tipus, utas, dij) values(?,?,?,?)`,data);
    tehát itt majd egy delete lesz és majd az ID lesz behelyetsítve nem a data
    ->
*/ 

async function deleteShip(id) {
    try {
        // Delete from 'hajo' table where 'id' matches the provided id
        const response = await conn.promise().query(
            `DELETE FROM hajo WHERE id = ?`, 
            [id] // Array with the ID to delete
        );

        // Optionally, return confirmation or the affected rows
        return response[0].affectedRows > 0 ? `Ship with ID ${id} deleted.` : `No ship found with ID ${id}.`;
    } catch (err) {
        console.log(err);
        return 'Error deleting the ship.';
    }
};

/*
    Hogyan lehet template engine-ket használni és HTML kódot megjeleníteni és ami nagyon fontos 
    a változókat is be tudunk majd helyetesíteni is ebbe a HTML kódba!!!!!!!! 

    csinálunk egy új mappát erre és ez lesz az EJS, mert ezzel tudunk majd HTML-et csinálni!!!! 

    ott is be kell írni majd az alapvető dolgokat 
    1. npm init 
    2. npm i express 
    3. npm i ejs
*/