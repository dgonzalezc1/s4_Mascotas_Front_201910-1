import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {MascotaService} from '../mascota.service';

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import { Mascota } from '../mascota';
import {NgForm} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { MascotaExtraviadaService } from '../../mascota-extraviada/mascota-extraviada.service';
import {Router} from '@angular/router'

@Component({
    selector: 'app-mascota-create',
    templateUrl: './mascota-create.component.html',
    styleUrls: ['./mascota-create.component.css']
})
export class MascotaCreateComponent implements OnInit 
{
    constructor(private route:ActivatedRoute, 
        private mascotaService:MascotaService,
        private mascotaExtraviadaService: MascotaExtraviadaService,
        private toastrService: ToastrService,
        private router: Router
    ){ 
        this.route.queryParams.subscribe(
            params => {
                this.mascotaExtraviadaId = Number(params['mascotaExtraviadaId'])
                console.log(this.mascotaExtraviadaId)
            }
        )
    }

    /**
     * Nueva mascota a crear
     */
    mascota : Mascota;

    /**
     * Imagen de la mascota
     */
    imagen;

    /**
     * id del proceso de mascota extraviada
     */
    mascotaExtraviadaId: number

    /**
    * Output que le dice al componente que el usuario ha creado una nueva mascota
    */
   @Output() create = new EventEmitter();


    /**
     * Output que le dice al componente que el usuario no desea continuar creando una mascota nueva
     */
    @Output() cancel = new EventEmitter();

    crearMascota() : Mascota
    {
        if(this.mascotaExtraviadaId){
            this.mascotaExtraviadaService.createMascota(this.mascotaExtraviadaId, this.mascota)
                .subscribe(
                    m => {
                        this.mascota = m;
                        this.create.emit();
                        this.router.navigate(['/mascotas/' + this.mascota.id]);
                        this.toastrService.success("La mascota ha sido creada", "Mascota Creada");
                    }
                )
        }else{
            this.mascotaService.crearMascota(this.mascota).subscribe((m)=>{
                this.mascota = m;
                this.create.emit();
                this.toastrService.success("La mascota ha sido creada", "Mascota Creada");
            });

        }
        console.log(this.mascota);
        return this.mascota;
    }

    cancelCreation() : void
    {
        this.cancel.emit();
        this.toastrService.success("Cancelado", "Cancelar");
    }

    changeListener($event) : void 
    {
        this.readThis($event.target);
    }

    /**
     * Lee el archivo pasado por parámetro 
     * @param inputValue 
     */
    readThis(inputValue: any): void 
    {
        var file:File = inputValue.files[0];
        var myReader:FileReader = new FileReader();
        
        myReader.onloadend = (e) => 
        {
            this.imagen = myReader.result;
            console.log(myReader.result);
            this.mascota.fotos = new Array<string>();
            this.mascota.fotos.push(this.imagen);
        }
    
        myReader.readAsDataURL(file);
    }

    ngOnInit(): void 
    { 
        this.mascota = new Mascota();
    }
}
