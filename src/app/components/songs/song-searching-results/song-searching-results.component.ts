import { Component, OnInit } from '@angular/core';
import {SongService} from "../../../services/songs/song.service";
import {ISong} from "../../../interfaces/isong";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {getPostTimeToString} from "../../../app.module";
import {ActiveService} from '../../../services/interactive/active.service';
import {ToastrService} from 'ngx-toastr';
import {StorageService} from '../../../services/storage.service';

@Component({
  selector: 'app-song-searching-results',
  templateUrl: './song-searching-results.component.html',
  styleUrls: ['./song-searching-results.component.css']
})
export class SongSearchingResultsComponent implements OnInit {
  songList: ISong[];
  page: number = 1;
  keyword: string;
  topSixSongs: ISong[];

  constructor(
    private songService: SongService,
    private activatedRoute: ActivatedRoute,
    private activeService: ActiveService,
    private toastService: ToastrService,
    private route: Router,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data =>{
      this.keyword = data.keyword;
      this.search(this.keyword);
    });
    this.getTopSix();
  }

  getTopSix(){
    this.songService.getTop10Song().subscribe(data => {
      this.topSixSongs = data;
    })
  }

  search(keyword){
    this.songService.getSongByName(keyword).subscribe(data=>{
      this.songList = data;
    })
  }

  convertTime(postTime): string{
    return getPostTimeToString(postTime);
  }
  likeSong(songId: number) {
    let userId = +localStorage.getItem("userId");
    console.log("userId :" + userId);
    if (userId == null || userId == undefined || userId == 0) {
      this.toastService.error("Chuyển hướng sang trang đăng nhập sau 2s", "Bạn chưa đăng nhập")
      setTimeout(()=> {
        this.route.navigateByUrl("/login")
      }, 2000)
    }
    else {
      this.activeService.likeSong(songId, userId).subscribe(data => {
        document.getElementById('like'+songId).innerHTML = 'Like ('+data.likes+')';
      })
    }
  }

  // Thêm bài hát vào danh sách phát
  addToTrack(data: ISong) {
    let isExisted: boolean = false;
    let song: any = {
      name: data.name,
      artist: this.getArtist(data),
      url: data.fileUrl,
      cover: data.imageUrl
    };
    let trackList: any[] = JSON.parse(sessionStorage.getItem('library'));
    if (trackList == null) {
      trackList = [];
    };
    trackList.map(next => {
      if (next.name == song.name && next.artist == song.artist && next.url == song.url) {
        isExisted = true;
      }
    });
    if (!isExisted) {
      trackList.unshift(song);
    }
    this.storageService.setItem('library', JSON.stringify(trackList));
  }

  // Lấy ra tên ca sĩ
  getArtist(song: ISong): string {
    let artistName: string = '';
    song.s_singers.map(singer => {
      artistName += singer.fullName + " ,"
    });
    if (artistName == '') {
      artistName = 'Various Artist '
    }
    return artistName.substring(0, artistName.length-1);
  }
}
