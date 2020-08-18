import { Component, OnInit } from '@angular/core';
import {SongService} from '../../../services/songs/song.service';
import {ISong} from '../../../interfaces/isong';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-song-delete',
  templateUrl: './song-delete.component.html',
  styleUrls: ['./song-delete.component.css']
})
export class SongDeleteComponent implements OnInit {
  song: ISong;
  constructor(private songService: SongService,
              private ac: ActivatedRoute,
              private route: Router) { }
  id=+this.ac.snapshot.paramMap.get('id');
  ngOnInit(): void {
    this.songService.getSongById(this.id).subscribe(resp =>{
      this.song = resp;
    })
  }
  summit(){
    this.songService.deleteSongById(this.song.id).subscribe( ()=>{
      this.route.navigate(['/user/music']);
    })
  }

}
