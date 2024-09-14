/*
    be kell importálni a mysql2-t!! mert ezt lesz majd az adatbázisunk és össze kell majd kötni egy host-val ide backend-hez 
*/

import mysql2 from "mysql2";

const conn = mysql2.createConnection(
    {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "vitorlasberles"
    }
);
/*
    Tehát ez lesz az adatbáziscsatlakozásunk 
    host-hoz be kell írni egy IP címet,
    felhasználónevet, ami jelen esetben csak valami, de majd ha itt van rendes account, akkor ahhoz van egy felhasználónevünk regisztrálva meg
    password is 
    database-t az adatbázist, amihez csatlakozunk 
*/

/*
    És itt van ez a QUERY metódus, ami vár egy string-et, ami majd az lesz, hogy INSERT vagy SELECT, attól függően, hogy mit szeretnénk majd 
    lekérdezni vagy hozzáadni a táblához 
    és vár egy callback-et, aminek lesz kettő paramétere, a data, vagyis az amit felvittünk vagy lekérdeztünk és egy egy error
    hogy volt-e valami error, esetleg rosszul írtuk be tábla nevét vagy ilyesmi
    (data, err)=> {if(err) console.log("errors ", err); return;}
    és ilyenkor lehet egy return is, hogyha volt valamilyen error, akkor ne menjünk tovább
    
    az egész 
    -> 
*/

conn.query("SELECT * FROM hajo WHERE tipus = 'Kalóz'", (data, err)=> {if(err) console.log("err ", err);return;});

/*
    És így tudunk behelyetesíteni adatokat, hogy elöször megadjuk, hogy az insert-nél, hogy milyen mezők lesznek majd szükségesek 
    insert into hajo (nev, tipus, utas, dij) 
    és utána jön a values() de itt nem írjuk be, hogy mik a values-ok amiket fel szeretnénk vinni, hanem a values-ban megadunk annyi 
    kérdőjelet, amennyi mezőt írtunk be az insert-nél 
    tehát ebben az esetben 4 mezőt akarunk kitölteni -> nev, tipus, utas, dij 
    és akkor values így fog kinézni 
    values(?,?,?,?)
    és ezután adjuk meg az adatokat egy tömbben -> ["Feri a hajó", "kalóz", 5, 9000]

    Ha ez meg van, akkor jön a második paraméter, amit vár a QUERY függvény és itt lesz majd a callback, ahol van egy data, az adatok, amiket 
    felvittünk és az err

    és nagyon fontos, hogy ezt egy függvényben csináljuk majd 
    -> 
*/

function insert() {
    conn.query(`INSERT INTO hajo (nev, tipus, utas, dij)
        VALUES(?,?,?,?)`, ["Feri a hajó", "kalóz", 5, 9000], 
    (err, data)=> {
        console.log(data);
        /*
            insertId -> az utolsó rekord id-ja, amit felvittünk az adott paranccsal 
            affectedRows -> hány rekordot érintett a parancs
        */
    })
};

/*
    Tehát ebben az esetben nem is kettő hanem inkább három paramétere lesz ennek a query-nek, mert 
    1. `INSERT INTO hajo (nev, tipus, utas, dij) VALUES(?,?,?,?) -> ahol megadjuk, hogy insert és hogy melyik tábla illetve a mezőket
    2. ["Feri a hajó", "kalóz", 5, 9000] -> ebben a tömbben lesz majd a values
    3. callback, amiben lesz a data, amit felvittünk vagy err, hogyha valamit rosszul írtunk be 

    console.log(data);
    Itt megmutatja, hogy milyen adatokat vittünk fel az adatbázisban, de még vannak itt egyébb információk 
    1. insertId -> az utolsó rekord id-ja, amit felvittünk, tehát itt ebben a táblában volt 40 rekord és mindegyiknek van egy id-ja ugye 
        40-ig, akkor ez a rekord amit az insert-vel hozzáadunk ennek az lesz az insertId-ja, hogy 41
    affectedRows -> mivel itt csak egy rekordot vittünk fel, ezért ez csak itt 1 lesz, de lehet több adatot, rekordot is felvinni 
        egyszerre, akkor ez annyi lesz, amennyi rekordot felvittünk, tehát, annyivel fog a tábla megváltozni!!!

    Ha valami hiba van, akkor az affectedRows 0 lesz és akkor tudjuk, hogy semmilyen változás nem történt és valami hiba van 
    de DELETE-nél is ugyanúgy müködik ez, tehát ha kitörlünk egy rekord-ot, akkor az affectedRows az 1 lesz, ha többet, akkor annyi 
*/

/*
    SQL injection 
    Általában véve a felhasználó által kontrollált input-ból hajtanak végre SQL parancsokat 
    A prepared statement erre a megoldás (Parametrizált SQL)
    Nem hagyjuk, hogy hozzáfüzze a felhasználó a saját kódját az SQL string-hez 

    Tehát ez a megoldás nem jó, hogy DELETE-nél ugye kell egy id, ami alapján törlünk egy rekordot 
    Ezt majd megkapja a függvény egy paraméterrel és akkor mikor beírjuk, hogy DELETE, akkor ez az id-t csak hozzáfüzzük 
*/

function deleteFeri(id) {
    conn.query("DELETE FROM hajo WHERE regiszter = " + id), (err, data)=> {
        console.log(data);
    } 
};

//és itt meghívjuk a függvényt és megadjuk neki, hogy melyik id-jút akarjuk majd letörölni 
// deleteFeri(41 OR regiszter = 40;)

/*
    Tehát milyen nem jó módszer, hogy megkapjuk az id-t és azt behelyetsítjük 
    -> 
    "DELETE FROM hajo WHERE regiszter = " + id
    ->
    Azért nem szabad ezt egy ilyen stringösszefüzéssek megoldani, mert olyan SQL kódot ír be a felhasználó, hogyha 
    kap egy ilyen input mezőt (egy sima egyszerű input mezőt), akkor olyan SQL kódot ír be amilyet akar 
    És ezért kell ezt így paraméteresen megoldani, mint az INSERT-nél 
    ->
    ["Feri a hajó", "kalóz", 5, 9000]
    Amit úgy hívnak, hogy prepared statement 
    A prepared statement az felkészül arra, hogy tömegesen (nagy mennyiségű adatokat) hozzon le vagy vigyen fel 
    tehát gyorsabb is tud lenni, mint egy nem prepared statement meg biztonságosabb is!!!!! 
*/

/*
    function insert() {
        conn.query(`INSERT INTO hajo (nev, tipus, utas, dij)
        VALUES(?,?,?,?)`, ["Feri a hajó", "kalóz", 5, 9000], 
    (err, data)=> {
        console.log(data);
    })

    Úgy most callback function-vel vittük fel az adatokat és azért problematikus ez a callback function-ös dolog, mert ha itt a data-t 
    használni kéne valahol (console.log(data);), akkor lehet, hogy insert nevű függvény is kapna egy callback function-t és akkor az már 
    két callback function de lehet, hogy kell majd egy harmadik vagy egy negyedik és ezért kell ezt promise-ként megcsinálni ezt a dolgot 
    !!!!!!!
    Mert, akkor nincs az a callback hell, hogy van egy function, aminek van egy callback function-je, ami meg van hívva és akkor az is hív egy 
    callback funtion-t és akkor így tovább és el lehet veszni annyi van 

    Ezért használjuk a mysql2 módult nem a sima mysql-t 
    Addig, ameddig nincsenek promise-ok benne, addig a mysql pontosan ugyanúgy müködik mint a mysql2
    Csak a mysql2-ben vannak promise-ok és még connection pool is -> egyszerre tud több adatbáziskapcsolatot fenntartani, de csak annyit 
    amennyire éppen szükség van, ezért meggyorsítja a kiszolgálást, tehát ha mondjuk van egyszerre 100000 felhasználonk, akkor annyi 
    adatbáziskapcsolatot tart fent, amennyi szükséges és ezeket újrahasználja

    -> index.js-re átmegyünk 
*/
