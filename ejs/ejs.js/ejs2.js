import { urlencoded } from "body-parser";
import express from "express";

const app = express();

app.get("/", (req, res)=> {
    res.send(`
        <h2>Szia!</h2>  
    `)
})

/*
    És ezzel is csináltunk egy HTML kódot, hogy a send-be itt beírtunk egy HTML kódot, 
    de ez a rosszabik megoldás 

    és, hogy ezt meg is tudjuk nézni, kell, hogy az app.listen() legyen valamelyik port-on 

    Emellett még be is kell írni a terninálba, hogy nodemon meg a file nevét
    tehát itt nodemon ejs2.js!!!!!

    Be kell legyen írva a package.json-ba, amit megkapunk akkor mikor npm init-elünk 
    hogy a type az module legyen 
    ->
    "type": "module"
*/ 

app.listen("3000"); //ez mindig kell, hogy a szerver elinduljon és meg tudjuk nézni a http://localhost:3000-en, hogy mit adunk vissza az app.get-vel

/*
    app.get("/", (res, req)=> {
    res.send(`
        <h2>Szia!</h2>  
    `)
})

Tehát ez a rosszabb módszer, mert lehet, hogy akarunk csinálni egy form-ot, nem csak annyit kiírni, hogy Szia! 
meg ez egész egy string-ben van benne

Ennek a megoldására találták ki a template engine-neket -> EJS 
Ha ilyeneket akarunk majd használni, akkor az első lépés, hogy installálni kell 
->
npm i ejs !!!!! 

Második lépés ha ejs-t akarunk használni, akkor kell mindig, hogy 
-> 
app.set("view engine", "ejs");
*/

app.set("view engine", "ejs");

/*
    Készítettünk egy views mappát, amiben lesznek majd a .ejs kiterjesztésű HTML-elek
*/

app.use(express.static("views"));

/*
    Itt nem kellett volna használni, mert ebbe a views mappában nem statikus fájlokat fogunk tárolni, hanem .ejs-es dinamikusakat 

    De az a lényeg, hogy a statikus fájlokat alapból nem találja az express 
    hanem ezt explicit be kell állítani -> app.use(express.static("views"));

    Készítünk egy home.ejs-t a views mappába meg még .ejs kiterjesztésű fájlokat 
    
    Fel lehet telpíteni valamilyen ejs-es kiterjesztést, hogy mutassa majd a szintaktikai hibákat   

    Egyenlőre csak annyit csináltunk, hogy a home.ejs ki lesz írva valami meg a profile.ejs is ki lesz írva valami h1-es tag-ben 
    <h1>This is the home page</h1> a home.ejs-en
*/

/*
    És ami nagyon fontos, hogy itt nem azt fogjuk mondani, hogy res.send(), hanem azt, hogy res.render() 

    app.get("/", (res, req)=> {
    res.send(`
        <h2>Szia!</h2>  
    `)
})
-> 
*/
app.get("/", (req, res)=> {
    res.render('home', {title: "Home page"});
    /*
        és amit itt be kell állítani a render()-ben, hogy res.render('home');
        tehát ez várja paraméterben, hogy melyik ejs fájl fogjuk megjeleníteni az adott url oldalon 
        tehát itt "/" és a home.ejs lesz megjelenítve 
        de majd a /profile-on meg a "profile" tehát a profile.ejs
    */
});

/*
    Miért lényeges, hogy ezt meg tudjuk itt oldalani, mert majd be lehet helyetesíteni
    ->
    ez van a home.ejs-en 
    <h1>This is the home page</h1>
    <h2><%=title %></h2>

    és itt pedig át tudunk neki adni egy title-t (egy objektumot) 
    -> res.render('home', {title: "Home page"});
    És akkor így át tudunk adni különböző adatokat paraméterként, amit majd be tudunk helyetesíteni a .ejs-be 
*/

//megcsináljuk a profile oldalt hasonlóan 

app.get("/profile", (req, res)=> {
    res.render("profile", {user: {name: "Olivér", email: "kovacs.oliver1989@gmail.com"}});
});

/*
    Itt átadtunk egy objektumot, amiben van egy objektum -> {user: {name: "Olivér", email: "kovacs.oliver1989@gmail.com"}}
    és innentől kezdve ezt be tudjuk majd helyetesíteni oda, ahova akarjuk a profile.ejs-ben
    ->
    <h2>Hello <%= user.name%></h2>
    <p>
        Your email address is: <%= user.email>
    </p>
*/

/*
    Mi van abban az esetben ha valamit feltételes kell render-elni 
    Ha ilyen a beállítás akkor így, ha olyan a beállítás, akkor úgy 
    -> 
    létezek erre if statement 
*/

//változtatott verzió 
app.get("/profile", (req, res)=> {
    res.render('profile', 
        {
            user: {name: "Olivér", email: "kovacs.oliver1989@gmail.com"},
            isAdmin: true
        });
});

/*
    És akkor a profile.ejs-re ha isAdmin az true, akkor renderelünk olda valamilyen tartalmat

    <% if(isAdmin) { %> 
    <p>
        Védett tartalom megjelenítése
    </p>
    <% } %>

    ilyenkor megjelenik, ha meg false lesz, akkor meg nem 
    így nem 
    ->
        res.render('profile', 
        {
            user: {name: "Olivér", email: "kovacs.oliver1989@gmail.com"},
            isAdmin: false
        });

<% if(isAdmin) { %> 
    <p>
        Védett tartalom megjelenítése
    </p>
    <% } else { %> 
        <p>
            Nem vagy jogosult a védett tartalom megjelenítésére
        </p>
>% } %>

    és akkor ennek lehet egy else ága is és attól függően, hogy az isAdmin az true vagy false más fog majd megjelenni

    Ez a conditional rendering ami volt a React-ban is, ami egy front-end-es dolog volt, ez meg nem 
    Az a különbség a kettő között, hogy a React az front-end-en generálodik és back-end-ből kapja általában az adatokat (de muszály a backend-ből
    kapni neki adatokat)
    de már csináltunk olyan példát, hogy API-ból kapott adatokat 
    Viszont az EJS az backend-en generálódik és már a legenerált HTML kódot fogja elküldeni a szervernek!!!!!!!!!!! 
*/

/*
    Mi van ha több adatot kell megjeleníteni, mondjuk egy tömbből 
*/

app.get("/products", (req, res)=> {
    res.render("products", {
        products: [{
            productID: 1, 
            productName: "Porszák nélküli kávéföző",
            price: "megfizethetetlen"
        }, 
        {
            productID: 2, 
            productName: "Fém faház", 
            price: 65000
        }
    ]
    });
});
/*
    Erre kell csinálni egy products.ejs-t 
    És mivel itt van egy tömb, amiben van két objektum, ezért, ha végig akarunk menni rajta a products.ejs-en kétféle módon lehet 
        - for
        - forEach

<% products.forEach((p)=> { %>
    <div>
        <h3><%=p.productName%></h3>
        <h5><%=p.price%> Ft.%></h5>
    </div>
<% }) %>

    Ez van a products.ejs-en és az a különbség, hogy react-ban így kell behelyetesíteni dolgokat {p.price} itt meg így <%=p.price%>
    és ha beírjuk a böngészőbe, hogy http://localhost:3000/products, akkor meg fog jelenni

    Tehát ha EJS-ben változókat akarunk megjeleníteni, akkor kell a = 

    Ez meg a for-os változat 
    ->

<% for(let i = 0; i < products.length; i++) { %>
    <div>
        <h3><%=products[i].productName%></h3>
        <h5><%=products[i].price Ft.%></h5>
    </div>
<% } %>

    Általában a forEach-es megoldás az könnyebb ilyen esetben, de ha az a lényeg, hogy csak simán elszámoljunk valameddig, akkor meg jobb a 
    for-os megoldás 
    -> 

<% for(let i = 1; i < 100; i++) { %>
    <div>
        <h3><%=i%></h3>
    </div>
<% } %>
*/

/*
    Csinálunk egy form.ejs-t, ahol van egy form-unk és szeretnénk beküldeni adatokat -

<form>
    <h3>Email</h3>
    <input type="text">

    <h3>Felhasználónév</h3>
    <input type="text">
</form>

De nagyon fontos, hogyha ilyen formában szeretnénk beküldeni adatokat, akkor be kell írni a metódust 
ami általában véve a adatokat küldünk, akkor az POST lesz
method="POST"

mert, hogyha get-et írunk, akkor az URL-ben fognak megjelenni URL változóban az adataink

A másik amit mindig meg kell csinálni, hogy megadjuk a name attributumokat!!! mindegyik input-nak 
->
<form method="post">
    <h3>Email</h3>
    <input name="email" type="text">

    <h3>Felhasználónév</h3>
    <input name="pass" type="text">

    <button>Bejelentkezés</button>
</form>

Ha így fogjuk megadni a form-ot, akkor url-encoded-ba fogja beküldeni az adatokat
ezért kell ha van egy form ezt mindig használni
->
*/

app.use(urlencoded({extended: true}));
/*
    Hogyha tömböt vagy objektumot küldenénk el form-on keresztül, akkor ez biztosítja, hogy a beágyazott adatokat is lássuk 
*/

//Elöször is kell csinálni ennek egy GET-eset kérést 
app.get("/login", (req, res)=> {
    res.render("form")
}); 
/*
    ha bemegyünk a login-ra, tehát a localhost:3000/login, akkor ott van a form-unk 

    De mivel ezt POST-ban küldjük be, ezért kell csinálnunk egy POST-os endpoint-ot is!!!!!!!!!!!!!!!
    ->  
*/

app.post("/login", (req, res)=> {
    res.render("form");
})
/*
    Ez azt fogja csinálni, hogy amennyiben megnyomtuk a gombot, abban az esetben ugyanarra a form-ra írányít vissza benünket, de azt is 
    tudnánk csinálni, hogy írányítson vissza benünnket a profile-ra 
    ->
*/
app.post("/login", (req, res)=> {
    res.render("profile");
})

/*
    Ehhez meg kell változtatni a profile.ejs-t is meg a form.ejs-re is felvisszük, hogy admin vagy-e 
    ->
        <h3>Admin vagy?</h3>
    <label>
        <input name="isAdmin" type="radio" value="1"> Igen 
    </label>

    <label>
        <input name="isAdmin" type="radio" value="0"> Nem 
    </label>

    Azért kell egy label-be betenni, hogy utána írhassuk, hogy Igen vagy Nem, mert ez egy input mező
    Fontos, hogy a name az mindegyik esetben ugyanaz legyen!!!!!! 
        mert csak akkor tudunk átkattintani, ha más a name-je, akkor mindegyik be tudjuk jelölni, ami jelen esetben nem jó 
    meg, hogy a value is be legyen állítva és különböző legyen!!

    És akkor van egy get-es meg egy post-os is, ami fogadja az adatokat 

    a profile meg megcsináljuk így
    app.get("/profile", (req, res)=> {
    res.render('profile', 
        {
            user: {userName: "Olivér", email: "kovacs.oliver1989@gmail.com", isAdmin: true},
        });

        ez meg a profile.ejs, ahol van egy userName amit megjelenítünk meg egy email meg az isAdmin

        <h1>This is the profile!</h1>
        <h2>Hello <%= user.userName%></h2>
        <p>
            Your email address is: <%= user.email>
        </p>

        <% if(user.isAdmin) { %> mert akkor a userben lesz minden -> user: {userName: "Olivér", email: "kovacs.oliver1989@gmail.com", isAdmin: true},
            <p>
                Védett tartalom megjelenítése
            </p>
        <% } else { %> 
            <p>
                Nem vagy jogosult a védett tartalom megjelenítésére
            </p>
        >% } %>
});
*/
app.post("/login", (req, res)=> {
    console.log(req.body);
    req.body.isAdmin = req.body.isAdmin == 1;
    res.render("profile");
})

/*
    Ami fontos itt, hogy a req.body-ban fogjuk megkapni az adatokat 
    mert POST-ot küldtünk és ez lesz az üzentestünk 

    és a form.ejs-en nem tudunk küldeni true vagy false-os adatokat, mert hiába írjuk be ide, hogy true vagy false az string lesz 
    <input name="isAdmin" type="radio" value="1"> Igen 
    <input name="isAdmin" type="radio" value="0"> Nem 
    Mert az input mezőkből mindig string-et kapunk vissza 
    Ezért kell ez 
    ->
    req.body.isAdmin = req.body.isAdmin == 1;
    fontos, hogy == nem ===, mert az egyik egy string 1-es (amit visszakapunk) lesz ez meg 1 number 1-es (amit ide beírtunk a kódba) 
    És akkor a string 1-est azt tudja egyeztetni a number 1-essel 
*/

app.post("/login", (req, res)=> {
    console.log(req.body);
    req.body.isAdmin = req.body.isAdmin == 1;
    res.render("profile", {user:req.body}); //!!!!!! 
});

/*
    Itt akkor csináltunk egy post-ot a login-ra, hogy meg tudjuk szerezni az adatokat, amiket beküldtünk a form.ejs-ből 
    ezt a REQ-ből lesz, tehát amit a kliens küld a szervernek és ott is a body-ban 
    1. login (oldal, mert abból várunk adatokat)
    2. req-ből fogjuk megkapni az adatokat (req.body)
    3. ott lesz egy olyan kulcs, hogy idAdmin (input, type radio, value 1)
        req.body.isAdmin = req.body.isAdmin == 1 -> tehát ez azt jelenti, hogy admin-ok vagyunk 
    4. res.render-vel pedig a szerver küld egy választ
        res.render("profile", {user:req.body})
    itt pedig a profile.ejs fogjuk majd render-elni, tehát az az .ejs fog megjelenni 
    és átadnuk neki egy objektumot is a req.body-t, amit itt megszereztünk és abban azok az adatok lesznek (email, felhasználónév, isAdmin)
    amit a user-ben megjelenítünk 
    -> 
    <h2>Hello <%= user.userName%></h2>
    <p>
        Your email address is: <%= user.email>
    </p>

    és a profile ha meg betölt, akkor így, fog kinézni 

app.get("/profile", (req, res)=> {
    res.render('profile', 
        {
            user: {name: "Olivér", email: "kovacs.oliver1989@gmail.com"},
            isAdmin: true
        });
});

és mivel a user-nek itt megadtuk azokat az adatokat, amiket a body-ból megkapunk (kitöltjük a form-ot és az alapján)
ezért a localhost:3000/profile oldalon mindig azok jelennek meg (adatok), amiket a login-on (post) felvittünk!!!!!!!!!!!!!!

Tehát itt fontos 
    - kell lennie egy get-nek, hogy megcsináljuk a login oldalt, meg kell lennie egy form.ejs-nek, hogy render-elni tudjuk, amikor /login van 
    - csinálunk egy login-ra egy post kérést (meg a form is egy post)
        itt bekérjük a req.body-t 
        render-vel megadunk neki egy másik oldalt, ahova átírányit, ha be vannak küldve az adatok (és az adatokat req.body)
            meg is adjuk majd ennek az oldalnak a render-ben -> res.render("profile", {user:req.body})
    - csinálunk egy olyan oldalt amire render-tünk 
        nekünk ez már meg volt és itt megjelenírjük az adatokat, amiket kaptunk a req.body-ban!!!! 
*/ 

/*
    de most a login-ban lett a render-tünk a profile-ra, de azt is meg lehet csinálni
    -> 
    ehelyett 

app.post("/login", (req, res)=> {
    console.log(req.body);
    req.body.isAdmin = req.body.isAdmin == 1;
    res.render("profile", {user:req.body}); //!!!!!! 
});

hogy -> 
*/
app.post("/profile", (req, res)=> {
    console.log(req.body);
    req.body.isAdmin = req.body.isAdmin == 1;
    res.render("profile", {user:req.body});
});
/*
    Viszont ilyen formában nagyon fontos, hogy ahol csináltuk a method="post"-ot a form.ejs-ben 
    ott megadjuk, hogy az action="profile"
    És akkor automatikusan, hogyha beküldjük a form-ot, akkor átírányit minket a profile-ra!!!!!!!!!!!!!!!!!!!!!!!
    
    <form method="post" action="/profile">
    <h3>Email</h3>
    <input name="email" type="text">

    És ilyenkor a profile-ban szerezzük meg a body-t!!!!
    Meg így életszerübb, hogy másik oldalra írányit át és nem ugyanarra!!!!  hanem itt profile-ra megyünk át app.post("/profile",
    és nem maradunk a login-en, mint az elöbb -> app.post("/login", mert ott hiába a profile.ejs-t jelenítettük meg attól még a 
    localhost:3000/login-en maradtunk ugyanazon az URL-en, ahol a form-ot kitöltötük, így meg átmentünk a localhost:3000/profile-ra 
    de ehhez az is kell, hogy a form.ejs a method="post" mellett legyen még egy átírányítás is -> action="/profile" !!!!!!!! 
*/

/*
    Összefoglalás 

    A template engine-ek arra valóak, hogy HTML kódba tudjunk ágyazni különböző változókat (változóknak az értékeit)
    Az egyik legnépszerübb az EJS 
    Ezt úgy tudjuk használni, hogy 
    1. npm i ejs 
    2. app.set("view engine", "ejs");
    3. Views mappa, ahol tároljuk az .ejs kiterjesztésű fájlokat, amik majd innen be lesznek olvasva
    4. nem azt fogjuk meghívni a res objektumból, hogy send vagy json, hanem az, hogy RENDER!! 
        ennek az első paramétere, hogy views mappában melyik ejs fájlt hsaználunk -> res.render("home")
        második paraméterben meg át tudunk adni neki mindenféle adatokat -> res.render("home", {title: "Home Page"});
        de ezek jöhetnek mondjuk adatbázisból is ezek az adatok 
        -> 
    Nagyon fontos, hogy így tudjuk majd összekötni az adatbázis adatait a HTML szerkezetünkkel!!! 
    az adatokat pedig tudjuk render-elni változómegjelenítéssel (amitt itt csináltunk) -> {user: req.body} vagy ciklusokkal 
    erre példa volt a products-os meg a profile-os 

    Ha szeretnénk form adatokat beküldeni az method post és meghatározunk neki egy action-t, ami azt határozza meg, hogy hova 
    írányitson át maga a rendszer 
    és itt fontos, hogy az input mezőknek meghatározzunk name attributumokat!!!!! 
    -> 
    mert ezek lesznek majd a res.body-nak a kulcsai!!!!!! 
    És csinálunk egy post endpoint-ot 
    -> 
app.post("/profile", (req, res)=> {
    console.log(req.body);
    req.body.isAdmin = req.body.isAdmin == 1;
    res.render("profile", {user:req.body});
});

a req.body-nak az adatait fel tudjuk dolgozni úgy, ahogy mi szeretnénk és ezt felhasználjuk a render-eléshez!!!!
-> 
res.render("profile", {user:req.body});
*/
