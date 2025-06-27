import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';
import { ChefCuisinierModule } from './chef-cuisinier/chef-cuisinier.module';
import { CuisinierModule } from './cuisinier/cuisinier.module';
import { LivreurModule } from './livreur/livreur.module';
import { Abonnements } from './entities/Abonnements';
import { Accompagnements } from './entities/Accompagnements';
import { AccompagnementTypeAbonnement } from './entities/AccompagnementTypeAbonnement';
import { Alertes } from './entities/Alertes';
import { Boissons } from './entities/Boissons';
import { BonsCommande } from './entities/BonsCommande';
import { Clients } from './entities/Clients';
import { ClientsIndividuelsFideles } from './entities/ClientsIndividuelsFideles';
import { CommandesEntreprises } from './entities/CommandesEntreprises';
import { CommandesEntreprisesDetails } from './entities/CommandesEntreprisesDetails';
import { CommandesIndividuelles } from './entities/CommandesIndividuelles';
import { CommandesIndividuellesDetails } from './entities/CommandesIndividuellesDetails';
import { CritereFidelite } from './entities/CritereFidelite';
import { ExemplairesIngredient } from './entities/ExemplairesIngredient';
import { FacturesEntreprises } from './entities/FacturesEntreprises';
import { FacturesEntreprisesDetails } from './entities/FacturesEntreprisesDetails';
import { FacturesIndividuelles } from './entities/FacturesIndividuelles';
import { FacturesIndividuellesDetails } from './entities/FacturesIndividuellesDetails';
import { Ingredients } from './entities/Ingredients';
import { LivraisonsEntreprises } from './entities/LivraisonsEntreprises';
import { LivraisonsIndividuelles } from './entities/LivraisonsIndividuelles';
import { Menus } from './entities/Menus';
import { MenusFavoris } from './entities/MenusFavoris';
import { MenuTypeAbonnement } from './entities/MenuTypeAbonnement';
import { MouvementsStock } from './entities/MouvementsStock';
import { PaiementsEntreprises } from './entities/PaiementsEntreprises';
import { PaiementsIndividuels } from './entities/PaiementsIndividuels';
import { PlanningProduction } from './entities/PlanningProduction';
import { Recettes } from './entities/Recettes';
import { Reduction } from './entities/Reduction';
import { Roles } from './entities/Roles';
import { Salaires } from './entities/Salaires';
import { SelectionsHebdomadaires } from './entities/SelectionsHebdomadaires';
import { Sessions } from './entities/Sessions';
import { SpatialRefSys } from './entities/SpatialRefSys';
import { StatutsCommande } from './entities/StatutsCommande';
import { TypesAbonnement } from './entities/TypesAbonnement';
import { Utilisateurs } from './entities/Utilisateurs';
import { ZonesLivraison } from './entities/ZonesLivraison';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',       // ou ton IP ou nom de domaine
      port: 5432,
      username: 'postgres',    // ou ton nom d’utilisateur
      password: 'postgres',
      database: 'cuisine_db',
      autoLoadEntities: true,  // auto importe les entités
      entities: [                                                                                                                                                          
        Abonnements,                                                                                                                                                                     
        Accompagnements,                                                                                                                                                                 
        AccompagnementTypeAbonnement,                                                                                                                                                    
        Alertes,                                                                                                                                                                         
        Boissons,                                                                                                                                                                        
        BonsCommande,                                                                                                                                                                    
        Clients,                                                                                                                                                                         
        ClientsIndividuelsFideles,                                                                                                                                                       
        CommandesEntreprises,                                                                                                                                                            
        CommandesEntreprisesDetails,                                                                                                                                                     
        CommandesIndividuelles,                                                                                                                                                          
        CommandesIndividuellesDetails,                                                                                                                                                   
        CritereFidelite,                                                                                                                                                                                                                 
        ExemplairesIngredient,                                                                                                                                                           
        FacturesEntreprises,                                                                                                                                                             
        FacturesEntreprisesDetails,                                                                                                                                                      
        FacturesIndividuelles,                                                                                                                                                           
        FacturesIndividuellesDetails,                                                                                                                                                    
        Ingredients,                                                                                                                                                                     
        LivraisonsEntreprises,                                                                                                                                                           
        LivraisonsIndividuelles,                                                                                                                                                         
        Menus,                                                                                                                                                                           
        MenusFavoris,                                                                                                                                                                    
        MenuTypeAbonnement,                                                                                                                                                              
        MouvementsStock,                                                                                                                                                                 
        PaiementsEntreprises,                                                                                                                                                            
        PaiementsIndividuels,                                                                                                                                                            
        PlanningProduction,                                                                                                                                                              
        Recettes,                                                                                                                                                                        
        Reduction,                                                                                                                                                                       
        Roles,                                                                                                                                                                           
        Salaires,                                                                                                                                                                        
        SelectionsHebdomadaires,                                                                                                                                                         
        Sessions,                                                                                                                                                                        
        SpatialRefSys,                                                                                                                                                                   
        StatutsCommande,                                                                                                                                                                 
        TypesAbonnement,                                                                                                                                                                 
        Utilisateurs,                                                                                                                                                                    
        ZonesLivraison,                                                                                                                                                             
      ],
      synchronize: false,       // synchronise tables automatiquement (à désactiver en prod !)
    }),
    AdminModule,
    ClientModule,
    ChefCuisinierModule,
    CuisinierModule,
    LivreurModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
