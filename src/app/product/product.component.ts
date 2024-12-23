import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {environment} from '../../environments/environment'
import { debounceTime, distinctUntilChanged, fromEvent, map, tap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit,AfterViewInit {
  baseUrl=environment.baseUrl
  productArr: any=[];
  pricerangeForm:FormGroup
  loaderflag:boolean=true;
  @ViewChild('searchcategory') searchcategory:ElementRef |undefined; 
  namesearch: any;
  productsComp: any=[];
  productDetailByIdArr: any;
  constructor(private productService:AuthService,private fb:FormBuilder,private modelservice:NgbModal) { 
    this.pricerangeForm=fb.group({
      minlength:[''],
      maxlength:['']
    })
  }
  
  ngOnInit(): void {
    this.productDetails()
    this.productsComp=JSON.parse(localStorage.getItem('productdetails')||'')
  }
  productDetails(){
    console.log("${this.baseUrl}products",`${this.baseUrl}products`)
    this.productService.getApi(`${this.baseUrl}products`).subscribe((res:any)=>{
          // console.log("res",res);
          if(res){
            this.productArr=res;
            localStorage.setItem('productdetails',JSON.stringify(this.productArr))
            this.loaderflag=false;
          }
    })
  }
  ngAfterViewInit():void{
    const searchTexts=fromEvent<any>(this.searchcategory?.nativeElement,'keyup').pipe(map(event=>event.target.value),debounceTime(500),distinctUntilChanged())
    searchTexts.subscribe(res=>{
      console.log("res",res)
      this.namesearch=res;
      this.productByName(this.namesearch)
    })
  
     
     
  }
  productByName(names:any){
    let product=JSON.parse(localStorage.getItem('productdetails')||'')
     let prod= product.filter((res:any)=>{
        if(res.category.startsWith(names)){
          return res;
        }
      })
      this.productArr=prod;
  }
  showProductFilterwise(val:any){
      console.log("val",val);
      

  }
  applySubmit(){
    let pricerangeres= this.productsComp.filter((res:any)=>{
      if(res.price>this.pricerangeForm.value.minlength && res.price< this.pricerangeForm.value.maxlength){
        return res;
      }
    })
    this.productArr=pricerangeres;
  }
  productModels(productId:any,mymodal:any){
    this.productDetailByIdArr = this.productsComp.find((product:any) => product.id === productId);
    console.log("this.productDetailByIdArr",this.productDetailByIdArr);
      this.modelservice.open(mymodal,{ size: 'lg' })
  }

}
