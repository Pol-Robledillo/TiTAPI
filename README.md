# TiTAPI
Hem utilitzat una base de dades PostgreSQL que es troba allotjada a AlwaysData. Hem utilitzat aquesta base de dades ja que és la que més sabem utilitzar.

Hem fet una aplicació de Node.js per la API que connecta amb la base de dades. La raó de fer la API amb Node és que ens va semblar més senzilla d’implementar que una feta en C#. Aquesta està allotjada en un servei de hosting anomenat Replit ja que és gratis i la direcció URL que se li assigna a una aplicació és sempre la mateixa.

Li hem instal·lat les següents llibreries:

- **Express**: el framework que hem utilitzat per l'aplicació, el vam escollir perquè és un dels que més s’utilitzen per fer APIs i també perquè és bastant senzill d’utilitzar.
- **Pg**: la llibreria per connectar amb bases de dades Postgres.
- **Fs**: la llibreria que hem utilitzat per emmagatzemar la configuració de la connexió a la base de dades en un fitxer a part del principal de l’aplicació.
- **Bcrypt**: utilitzada per hashejar les contrasenyes dels usuaris i per fer les comparacions amb les emmagatzemades a la base de dades.
- **CORS**: vam haver d’afegir aquesta llibreria per poder accedir a l’API des de la web ja que donava un error al fer la connexió perquè cada una es troba en un domini diferent.

Per utilitzar aquesta API s'ha d'iniciar des del servei de hosting de Replit o obrint una terminal al directori de la aplicació i executar la comanda "node index.js".

Pots trobar l'API implementada en Node.js allotjada a Replit en aquest [enllaç](https://replit.com/@polrobledillo7e/TiTAPI#index.js)
