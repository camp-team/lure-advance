import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thing } from '@interfaces/thing';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ThingService } from 'src/app/services/thing.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { ThingRef } from '@interfaces/thing-ref';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  thing$: Observable<Thing> = this.route.parent.paramMap.pipe(
    switchMap((map) => this.thingService.getThingByID(map.get('thing')))
  );

  constructor(
    private route: ActivatedRoute,
    private thingService: ThingService
  ) {}

  ngOnInit(): void {}

  async downLoadZipFile(thing: Thing, refs: ThingRef[]) {
    const zip = new JSZip();
    await Promise.all(
      refs.map(async (ref) => {
        const data = await JSZipUtils.getBinaryContent(ref.downloadUrl);
        const fileName = ref.fileName;
        return zip.file(fileName, data, { binary: true });
      })
    );
    const res = await zip.generateAsync({ type: 'blob' });
    const fileName = `${thing.id}.zip`;
    saveAs(res, fileName);
  }

  async downLoad(ref: ThingRef) {}
}
