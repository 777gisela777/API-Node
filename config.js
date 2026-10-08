export const {
    PORT=3000, //Port del server
    SALT_ROUNDS=10, //Quants salts farà per encriptar, quants més salts faci més trigarà, però més complexa serà l'encriptació
    SECRET_JWT_KEY="aixo-es-una-super-paraula-secreta" //Clau secreta
}=process.env