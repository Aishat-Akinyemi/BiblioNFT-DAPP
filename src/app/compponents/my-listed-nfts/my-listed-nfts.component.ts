import { BigNumber } from 'bignumber.js';
import { BnftService } from './../../services/bnft.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-listed-nfts',
  templateUrl: './my-listed-nfts.component.html',
  styleUrls: ['./my-listed-nfts.component.css']
})
export class MyListedNftsComponent implements OnInit {

  public nfts: any[] = [];
  isLoading= false;
  constructor(private bnftService: BnftService, private http: HttpClient, private router: Router ) { }

  public async ngOnInit(): Promise<void> { 
    try{
      this.isLoading = true;
    const _nfts = await this.bnftService.getMyListedNfts();
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
    }}
}