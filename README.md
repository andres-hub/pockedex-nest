<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecuatar en desarrollo
1. Clonar repositorio
2. Ejecuatar

```
yarn install
```

3. Tener Nest CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la db

```
docker-compose up -d
```

5. Clonar el archivo __.env.template__ y renombrer la copia a __.env__

6. llenar las variables definidas en el ```.env```

7. Ejecutar la aplicacion en dev
```
npm run start:dev
```

6. Reconstruir la base de datos con la semilla

```
http://localhost:3000/api/seed
``` 

## Stack usado
* MongoDB
* Nest

# Notas
Heroku redeploy sin cambios:
```
git commit --allow-empty -m "Tigger heroku deploy"
git push heroku main
```
