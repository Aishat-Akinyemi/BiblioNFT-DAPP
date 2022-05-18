import { BigNumber } from 'bignumber.js';
import { BnftService } from './../../services/bnft.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-nfts',
  templateUrl: './my-nfts.component.html',
  styleUrls: ['./my-nfts.component.css']
})
export class MyNftsComponent implements OnInit {
  selectedToken!:string;
  public nfts: any[] = [];
  isLoading!:boolean;
  price!: number;

  constructor(private bnftService: BnftService, private http: HttpClient, 
    private modalService: NgbModal, private router: Router) { }

  public  ngOnInit() { 
    (async () => {
      try{
      this.isLoading = true;
      const _nfts = await this.bnftService.getMyPurchasedNfts();
      this.nfts = await Promise.all(_nfts.map(async (nft) => {
        const tokenUrl = await this.bnftService.getTokenUrl(nft.tokenId);
        const metadata: any = await this.http.get(tokenUrl).toPromise();
        this.isLoading = false;
        return {
          owner : nft.owner,
          isListed : nft.isListed,
          seller: nft.seller,
          price: new BigNumber(nft.price.toString()).shiftedBy(-this.bnftService.ERC20_DECIMALS).toFixed(2),
          name : metadata.name,
          description: metadata.description,
          image: metadata.image,
          content: metadata.content,
          properties: metadata.properties,
          tokenId: nft.tokenId        
        }
      }));
      this.isLoading = false;  
    }catch{
      this.isLoading = false;
    }   
     
    })();

    
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async relistNFT(){
    
    this.bnftService.relist(this.selectedToken, this.price.toString()).then(
    async (result) => {
      this.isLoading = false;
      await this.router.navigate(['/my-listed-nfts']);
     }
     //if or else success

   ).catch(error => {
    this.isLoading =false;
    
   });

  
    

  }

  setTokenId(tokenId:any){
    this.selectedToken = tokenId;
  }



}