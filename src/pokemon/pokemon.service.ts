import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagintion.dto';

@Injectable()
export class PokemonService {

  private readonly defaultLimit: number;

  constructor( 
    @InjectModel(Pokemon.name)    
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService 
  ){
    // console.log(process.env.DEFAULT_LIMIT)
    // console.log(configService.get('defaultLimit'))
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }

  async create( createPokemonDto: CreatePokemonDto ) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;      
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll({limit = this.defaultLimit, offset = 0}: PaginationDto) {
    return this.pokemonModel.find().limit(limit).skip(offset).sort({no: 1}).select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // Search for no
    if( !isNaN(+term) )
      pokemon = await this.pokemonModel.findOne({no: term});
    
    // search for id
    if( !pokemon &&  isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);
    
    // search for name
    if(!pokemon)
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});

    if(! pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term} not found"`);

    return pokemon;

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    updatePokemonDto.name = (updatePokemonDto.name)? updatePokemonDto.name.toLocaleLowerCase(): updatePokemonDto.name;
    try {
      await pokemon.updateOne(updatePokemonDto, {new: true});
    } catch (error) {
      this.handleExceptions(error);
    }
    return {...pokemon.toJSON(), ...updatePokemonDto};
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id); 
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount ===0)
      throw new BadRequestException(`Pokemon with id ${ id } not found`);
    return;
  }

  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
  
}
