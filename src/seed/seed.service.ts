import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor( 
    @InjectModel(Pokemon.name)    
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  async executeSeed() {

    // opcion uno de crear multiples regitros 
    // const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    // const instertPromisesArray = [];
    
    // data.results.forEach(({name, url})=>{
    //   const segments = url.split('/');
    //   const no = +segments[segments.length - 2];
    //   instertPromisesArray.push(this.pokemonModel.create({name, no}));
    // });
    
    // await this.pokemonModel.deleteMany({});
    // await Promise.all(instertPromisesArray);

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: {name: string, no: number}[] = [];
    
    data.results.forEach(({name, url})=>{
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonToInsert.push({name, no});
    });
    
    await this.pokemonModel.deleteMany({});
    await this.pokemonModel.insertMany(pokemonToInsert);

    return "Seed Executer";

  }

}
