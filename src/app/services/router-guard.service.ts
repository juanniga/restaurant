import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,Router } from '@angular/router';
import jwt_decode from "jwt-decode"
import { GlobalConstans } from '../shared/global-constans';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
@Injectable({
  providedIn: 'root'
})
export class RouterGuardService {

  constructor(public router:Router,
    public auth:AuthService,
    private snackBarService:SnackbarService) { }
    canActivate(router:ActivatedRouteSnapshot):boolean{
      let expectedRoleArray = router.data;
      //expectedRoleArray = expectedRoleArray.expectedRole;
      const token:any=localStorage.getItem('token');
      var tokenPayLoad:any;
      try{
        tokenPayLoad = jwt_decode(token);
      }catch(err){
        localStorage.clear();
        this.router.navigate(['/']);
      }
      let checkRole = false;
      /*for(let i=0;i<expectedRoleArray.length;i++){
        if(expectedRoleArray[i] == tokenPayLoad.role){
          checkRole = true;
        }
        //this.snackBarService.openSnackBar();
      }*/
      //if (tokenPayLoad.role == 'user' || tokenPayLoad.role == 'admin') {
        if (this.auth.isAuthenticated()) {
          return true;
        } else {
        this.router.navigate(['/']);
        localStorage.clear();
        return false;
      }
    }
}
