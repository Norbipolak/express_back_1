/*
Mi az az EJS?

Az EJS (Embedded JavaScript) egy sablonmotor, amely lehetővé teszi, hogy HTML-be ágyazzunk JavaScript kódot!!!!! 
Ez azt jelenti, hogy dinamikusan tudunk tartalmat generálni egy weboldalon úgy, hogy az adatokat küldünk a szerverről a sablonba!!!! 
Nagyon hasznos, ha dinamikus oldalakat akarunk létrehoni, ahol az adatok változnak pl. egy felhasználói profil vagy egy lista 

Elöször telepíteni kell a csomagot 
->
npm i ejs 

Mire kell a app.set("view engine", "ejs");

Ez azt mondja az Express-nek, hogy az alkalmazás nézet motorja (view engine) az EJS lesz.
Ez azt jelenti, hogy amikor a szerver megpróbál visszaadni egy HTML oldalt, az EJS motor fogja feldolgozni a sablonokat 
és dinamikusan beilleszteni a szükséges adatokat!!!!!! 

    app.set("view engine", "ejs") 
    Ezzel az Express-ben beáálítjuk, hogy a res.render() hivásokat az EJS motor kezelje. 
    A nézetfájlok .ejs kiterjesztésű fájlok lesznek, és automatikusan azokat a fájlokat keresi az Express!!!!!!!!!!! 
*/

//Példa EJS használatára 
// 1. szerver oldalon, ami nekünk majd az ejs2.js-ben lesz 

import express from "express";

const app = express();

//Beállítjuk az EJS-t mint nézetmotort 
app.set("view engine", "ejs");

//példa route 
app.get("/", (req, res)=> {
    const nev = "Dalma";
    res.render("index", { nev }); //majd az index.ejs fájl lesz ebben a példában render-elve 
});

//Szerver indítása
app.listen(3000, ()=> {
    console.log("A szerver fut a http://localhost:3000 címen");
})

/*
    2. Nézet fájl (az a neve, hogy index.ejs) 

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Üdvözlet</title>
    </head>
    <body>
        <h1>Hello, <%= nev %>!</h1>
    </body>
    </html>

    és nagyon fontos, hogyha ide be akarunk illeszteni valamit, minthogy itt 
    -> 
    res.render("index", { nev })
    Megadtuk, hogy mi legyen a file neve ami majd megjelenjen és csináltunk valamit amit át is akarunk majd adni neki nev

    Azt így tudjuk majd beilleszetni az ejs file-unkba -> <%= nev%>
    Tehát ha beillesztés van akkor mindig két %% közé kell és kell még az egyenlőség jel is %= amit be akarunk illeszteni%
*/

/*
    Mi történik itt 
    - app.set("view engine", "ejs") 
        beállítja, hogy a szerver az EJS fájlokat használja nézetként 
    
    - res.render("index", { nev })
        Azt jelenti, hogy az index.ejs fájl fogjuk renderelni (tehát az fog majd megjelenni a kliensnek) és egy objektumot küldünk 
        amelyben a kulcs nev és az az értéke, hogy "Dalma"

    - Az EJS sablon pedig dinamikusan beilleszti az értéket ( <%= nev%>), ami az index.ejs fájlban megjelenik, és a végén a böngészőben 
    a következő jelenik meg -> "Helló Dalma"
*/

/*
    Hol kell elhelyezni a nézet fájlokat 

    Az Express automatikusan keresi a nézet fájlokat egy views nevű mappában, amelynek a gyökérkönyvtárban kell lennie 
    Tehát a fenti példában létre kell hoznunk egy views mappát, és abba tenni a index.ejs fájlt 

    Összefoglalva: 

    - app.set("view engine", "ejs") sorral az Expressben beáálítjuk a EJS view engine-ként 
    - az EJS lehetővé teszi, hogy dinamikusan adatokat jelenítsünk meg HTML-ben!!!! 
    - EJS sablonok a views mappába kell tenni, és .ejs kiterjesztést kell használni!!!!  
*/

/*********************************************************************************************************************************************/

/*
    Mi az az express.static() 

    Az express.static() egy beépített köztes réteg (middleware) az Express-ben 
    Amely statikus fájlok (pl.CSS, JavaScript, képek) kiszolgálára szolgál 
    Statikus fájlok alatt olyan fájlokat értünk, amelyek nem változnak dinamikusan, mint egy HTML sablon 
    hanem "készen állnak" a kiszolgálásra, pl. egy CSS fájl stiluslapként, vagy egy kép 
    
    Hogyan müködik az express.static();

    Az express.static() segítségével a szerver kiszolgálja a kliens (pl.böngésző) által kért statikus fájlokat egy megadott mappából!!! 
    Ez azt jelenti, hogyha van egy public nevű mappánk, amelyben CSS fájlok vagy képek stb. vannak, akkor ezek elérhetőek lesznek a weboldalon 
    ha beállytjuk az Express-ben, hogy ezeket a fájlokat statikusan szolgálja ki!!!!! 

    Mikor hasznájuk? 

    Ezt akkor használjuk, hogyha szeretnénk, hogy a szerver automatikusan kiszolgálja a statikus erőforrásokat 
    Pl. ha van egy styles.css fájlunk a public mappában, akkor a következőképpen tudjuk statikusan kiszolgálni!!! 
    -> 
*/
app.use(express.static("public"));

/*
    Mi van, ha így van, hogy a statikus fájlok együtt vannak a nem statikus-val, tehát a views mappában van mindegyik 

    Ha így irjuk, akkor az Express a views mappából kiszolgálja a statikus fájlokat 
    De ez nem szokványos megoldás, mert a views mappában általában a dinamikus sablonok tehát a .ejs-es HTML fájlok vannak 
    nem pedig a statikusak, hogy CSS, képek, stb. 
*/

/*
    Statikus fájlok és sablonok különválasztása

    Statikus fájok 
    Olyan fájlok mint a CSS, képek, JavaScript fájlok 
    Ezeket egy külön mappába pl. assets vagy public kell elhelyezni, és az Express-vel statikusan szolgáljuk ki őket 

    Sablonfájlok (views)
    Ezek a dinamikus HTML sablonok, mint amilyen az EJS. Ezeket a views mappában kell tárolni!!!
    és az Express dinamikusan rendereli őket!!! 
*/

/*
Fájlstruktura 

my-app/
├── views/         // Dinamikus sablonok (pl. EJS)
│   └── index.ejs
├── public/        // Statikus fájlok (CSS, képek stb.)
│   └── styles.css
└── app.js         // Express szerver
*/

//Szerver beállítása 
import express from "express";
const app = express();

//Statikus fájlok kiszolgálása a "public" mappából 
app.use(express.static("public"));

//Beállítjuk az EJS-t, mint nézetmotort 
app.set("view engine", "ejs");

//Dinamikus oldal renderelése 
app.get("/", (res, req)=> {
    res.render("index"); //ami az ejs fájl neve!! 
});

//Szerver indítása 
app.listen(3000, ()=> {
    console.log("A szerver fut a http://localhost:3000 címen");
});

/*
    Összefoglalás:

    - express.static()-ot akkor használjuk, ha statikus fájlokat (pl. CSS, képek) akarunk kiszolgálni.
    - A statikus fájlokat általában egy külön mappában (pl. public) tároljuk.
    - A views mappa dinamikus sablonok számára van fenntartva, mint az EJS.
*/

/*
    Mi az az urlencoded()

    Az urlencoded() egy köztes réteg (middleware) az Express-ben, amely lehetővé teszi, hogy a szerver képes legyen értelmezni az URL-ben 
    vagy űrlapokon elküldött adatokat, különösen a POST kérések során 
    Az űrlapadatok (mint pl. amikor egy felhasználó beír valamit egy beviteli mezőbe és elküldi az adatokat) 
    URL kódolva érkeznek és ezt az Express szervernek értelmeznie kell!!! 

    Hogyan müködik

    Amikor egy kliens (böngésző) elküld egy űrlapot POST metódussal, az adatokat URL kódolt formában küldi a szervernek 
    Az urlencoded() middleware biztosítja, hogy az Express szerver automatikusan értelmezze ezeket az adatokat és elérhetővé tegye 
    a req.body objektumban!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    Mit jelent az extended: true 

    Az extended opció arra vonatkozik, hogyan kezelje az URL kódolt adatok összetettebb formátumait 
    pl. ha az űrlapban beágyazott objektumokat vagy tömböket küldünk 

        extended: true 
        Lehetőve teszi az összetettebb adatszerkezetek, mint pl. a tömbök vagy a beágyazott objektumok feldolgozását is 

        extended: false
        Csak egyszerű kulcs-értékpárokat képes feldolgozni, de nem tud összetettebb objektumokkal vagy tömbökkel dolgozni 
        
        Tehát extended: true ha bonyolultabbb űrlapokkal dolgzunk!!!!!!! 
*/

import express from "express";
const app = express();

//Köztes rétegek a POST kérések adatainak feldolgozására (URL kódolt adatok)
app.use(express.urlencoded({extended: true}));

//Példa POST route 
app.post("/submit", (req, res)=> {
    console.log(req.body); //az űrlap adatai itt jelennek meg 
    res.send("Adatok fogadva");
});

// Szerver indítása
app.listen(3000, () => {
    console.log("A szerver fut a http://localhost:3000 címen");
});

/*
    Űrlap, amit kliens oldalon használunk 

<form action="/submit" method="POST">
    <input type="text" name="nev" placeholder="Add meg a neved">
    <input type="text" name="email" placeholder="Add meg az e-mailed">
    <button type="submit">Küldés</button>
</form>
*/

/*
    
Mi történik itt?

Amikor a felhasználó kitölti az űrlapot, majd elküldi, az Express fogadja a POST kérést, 
és az express.urlencoded({ extended: true }) köztes réteg segítségével feldolgozza az elküldött adatokat.

A feldolgozott adatok ezután elérhetővé válnak a req.body objektumban, ahol a kulcsok az űrlapon megadott nevek lesznek 
(például nev és email), és az értékek az, amit a felhasználó beírt.

Összefoglalás:
    - Az express.urlencoded({ extended: true }) middleware lehetővé teszi az Express számára, 
    hogy kezelje az űrlapokból érkező URL-kódolt adatokat.

    - Az extended: true opció lehetővé teszi bonyolultabb adatszerkezetek, például beágyazott objektumok és tömbök feldolgozását.

    - Az adatokat a POST kérés során a req.body objektumban kapod meg.
*/