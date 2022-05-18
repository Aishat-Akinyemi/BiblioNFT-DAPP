import { IpfsService } from './../../services/ipfs.service';
import { BnftService } from './../../services/bnft.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  isSignedIn: boolean = false;
  nftMintingForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required],
    price: [, Validators.required],
    content: ['', Validators.required],
    properties: ['', Validators.required], 
    imageUrl: [null, Validators.required],
    contentUrl: [null, Validators.required]  
  });
  closeResult!: string;
  isLoading: boolean = false;
  constructor(private bnftService: BnftService, private fb: FormBuilder, 
    private modalService: NgbModal, private ipfsService : IpfsService, 
    private router: Router ) { }

  ngOnInit(): void {   
  }
  
  connectWallet() {
  
  }

  disconnectWallet(){
     
  }
  
  viewstate(){
   
  }


  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      
    });
  }
  

  
 
  
    public async uploadImage(eventTarget:any){
      const fileUrl = await this.ipfsService.uploadFile(eventTarget.files[0]);
      this.nftMintingForm.get('imageUrl')?.setValue(fileUrl);      
   }
    public async uploadContent(eventTarget:any){
      const fileUrl = await this.ipfsService.uploadFile(eventTarget.files[0]);
      this.nftMintingForm.get('contentUrl')?.setValue(fileUrl);      
   }
   public async uploadMetadata(){
     if(this.nftMintingForm.valid){       
       const name = this.nftMintingForm.get('name')?.value
       const image = this.nftMintingForm.get('imageUrl')?.value
       const content = this.nftMintingForm.get('contentUrl')?.value
      const description = this.nftMintingForm.get('description')?.value
      const properties = this.nftMintingForm.get('properties')?.value
      const metaDataUrl = await this.ipfsService.uploadFile(JSON.stringify({
        name,
        image,
        description,
        content,
        properties
      }));
      this.isLoading = true;
      const isAdded = await this.bnftService.mintAndListNFT(metaDataUrl, this.nftMintingForm.get('price')?.value.toString()).then(
        (result) =>{
          this.isLoading = false;
          if (result) {
            this.router.navigate([ '/my-listed-nfts' ]);
          }        

        }).catch((e)=> {
          this.isLoading = false;
        }) 
       } else {
      console.error('error minting NFT');
    }
  }
}
