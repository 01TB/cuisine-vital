import { Controller, Get, Patch, Param, Body, Post } from '@nestjs/common';
import { ChefCuisinierService } from './chef-cuisinier.service';
import { Menus } from '../entities/Menus';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Ingredients } from 'src/entities/Ingredients';

@Controller('chef-cuisinier')
export class ChefCuisinierController {
  constructor(private readonly chefCuisinierService: ChefCuisinierService) {}

  @Get('menus')
  async getAllMenus(): Promise<Menus[]> {
    return this.chefCuisinierService.getAllMenus();
  }

  @Get('ingredients')
  async getAllIngredients(): Promise<Ingredients[]> {
    return this.chefCuisinierService.getAllIngredients();
  }

  @Post('menus')
  async createMenu(@Body() dto: CreateMenuDto): Promise<Menus> {
    return this.chefCuisinierService.createMenu(dto);
  }

  @Get('commandes/today')
  async getCommandesToday() {
    return this.chefCuisinierService.filterCommandes(new Date());
  }

  @Get('commandes/all')
  async getAllCommandes() {
    return this.chefCuisinierService.getAllCommandes();
  }

}

