/*
    Template engine-eknek a lényege, nem csak, hogy tudunk CSS és HTML kódot társítani 
    Hanem még az is müködőképes, hogy a HTML kódba behelyetesítsünk olyan értékeket, változókat 
    amiket az egyes endpoint-okból kaptunk meg!!!!!!!! 

    Mi az az express 
    -> 
    Az express egy webes keretrendszer a Node.js számára, amely leegyszerűsíti a webalkalmazások és az API-k készítését 
    Sok funkciót biztosít, amelyek segítenek webes és mobilalkalmazások fejlesztésében, és megkönnyíti olyan feladatok kezelését 
    mint a routing (útvonalkezelés), middleware-ek használata, illetve HTTP kérések és válaszok kezelése 

    Miért használjuk az EXPRESS-t 
    -> 
    Ha express nélkül dolgoznánk, a Node.js közvetlen használata a webszerverek építéséhez sok alacsony szintű részlet kézi 
    kezelését igényelné, pl. útvonalak kezelését, a kérés testének elemzését, és statikus fájlok kiszolgálását 
    Az Express ezt leegyszerűsíti azáltal, hogy egy absztrakciós réteget biztosít, amely hatákonyabbá és könnyebbé teszi ezeket a feladatokat 

    Mit csinál az import express from "express"
    ->
    A kódban ez a sor az Express modult importálja, hogy létrehozhassunk egy webszervert, és könnyen kezeljük a HTTP kéréseket 
*/
import express from "express";
/*
    Ez importálja a Express keretrendszert. Olyan mintha behoznánk egy könyvtárat a kódunkba, amely lehetővé teszi, hogy használjuk 
    az Express által biztosított összes funkciót és szolgáltatást

    Miért érdemes Express-et használni 

    1. Routing 
    Az Express leegyszerűsíti az alkalmazásunkban a különböző URL-ek kezelését.
    Pl. egyszerűen beáálíthatunk útvonalakat, olyan URL-ekhez, mint a /, /about vagy /api/users 

    2. Middleware-k 
    Az Express támogatja a middleware-eket, amelyek lehetővé teszik extra funkciók hozzáadását, pl. naplózás, kérés elemzés, hitelesítés, 
    mielött a kérések kezelése megtörténne.
    
    3. Kérés/Válasz kezelés 
    Segít a bejövő kérések (mint a GET, POST, PUT, DELETE) kezelésében, és visszaküld különböző válaszokat 

    4. Statikus fájlok kiszolgálása 
    Könnyen kiszolgálhatunk statikus fájlokat, mint a HTML, CSS, JavaScript vagy képek 

    Példa egy egyszerű EXpress szerverre 
*/ 

const app = express();
/*
    nagyon fontos, hogy miután be lett importálva az Express 
    akkor azt meg is kell majd hívni 
    ->
    const app = express();

    Ezután majd, miután meg van hívva egy változóban, onnan tudunk majd az Expressnek bizonyos metódusait használni 
    - get 
    - use 
    stb.
*/

//Beáálítunk egy alapútvonalat 
app.get('/', (res, req)=> {
    res.send('Hello');
});

//Elinditjuk a szervert és figyelünk egy port-on
app.listen(3000, ()=> {
    console.log("The server is listening on http://localhost:3000");
});

/*
    Ebben a példában 

    app.get("/", ..) -> 
    Meghatározza az alap URL (gyökér URL /) útvonalát és amikor valaki meglátogatja ezt az URL-t, akkor visszaküld egy 
    "Hello" üzenetet  

    app.listen(3000, ...) -> 
    Elinditja a szervert a 3000-as port-on és figyeli a bejövő kapcsolatokat 
*/ 

/*
    Fontosabb Express metódusok, mivel itt meg van hívva az express() egy változóban, ezért ezeket úgy érhetjük el, hogy 
    const app = express();
    metódusai -> app.valami 

    1. app.get();
    Ez egy GET kérést kezel, amely az egyik leggyakoribb HTTP kérés. Amikor valaki meglátogat egy URL-t a böngészőjében
    az egy GET kérés. Ez a metódus arra szolgál, hogy a szerver választ küldjön a kliensnek, amikor egy adott útvonalat kérnek be
    
    2. app.post() 
    Ez a POST kérés kezelésére szolgál. Amikor egy űrlapot küldünk el az oldalon (pl. bejelemtkezési adatok) 
    az egy POST kérés. A POST kérés általában adatküldésre szolgál a szerver felé.

    3. app.put() 
    A PUT kérést, akkor használjuk, amikor valamit frissítünk a szerveren. pl. egy meglévő felhasználó adatait lehet vele frissíteni 

    4. app.delete() 
    Ez a DELETE kérés arra szolgál, hogy egy erőforrást (pl. adatbázisból egy sort) töröljünk

    5. app.use() 
    Ezzel köztes rétegeket (middleware-eket) lehet hozzáadni. A middleware egy olyan funkció, amely a kérések feldolgozása során 
    a kezdet és a végpont között fut pl. hitelesítés, naplózás 
*/

/*
    app.get('/', (res, req)=> {
    res.send('Hello');  
    });

    Mi az a res és a req?

    req (request)
    Ez a kliens által küldött KÉRÉS. 
    Ez az objektum tartalmazza az összes információt, amit a kliens küld a szervernek.
    Pl. ha meglátogatjuk a /about oldalt, akkor a req tartalmazza az URL-t, a kéréssel kapcsolatos adatokat, a HTTP fejléceket stb.

    res (response)
    Ez az objektum jelenti a SZERVER VÁLASZÁT a kliens felé. 
    Itt adhatjuk meg, hogy mit küld vissza a kliensnek legyen az HTML oldal vagy egy JSON objektum 
*/

app.get("/", (res, req)=> {
    res.send("Hello");
});

/*
    1. app.get() 
    Amikor egy kliens (pl. böngésző) kéri a "/" útvonalat, akkor ez a funckió fog lefutni 

    2. res.send()
    A send metódus itt arra használjuk, hogy visszaküldjön valamit a kliensnek!!! 
    Ez lehet bármilyen adat, amit szeretnénk visszaadni (HTML, JSON, stb.)

    Összefoglalva
    - A REQ tartalmazza kliens által küldött adatokat (pl. URL, HTTP fejlécek, POST adatok)
    - A RES az, amivel visszaküldünk egy választ a kliensnek 
    - send() egy function, amely a tényleges választ (szöveg, JSON, HTML) küldi vissza a kliensnek!!! 
*/

/*
    ejs2.js lesz amit ténylegesen csináltunk az órán 
*/