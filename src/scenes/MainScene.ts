import {
  AmbientLight,
  DirectionalLight,
  Scene,
  TextureLoader,
  MeshBasicMaterial,
  BackSide,
  BoxGeometry,
  Mesh,
  Object3D,
  Clock,
} from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class MainScene extends Scene {
  private glbLoader = new GLTFLoader();
  private fighterJet = new Object3D();
  private missile = new Object3D();

  private clock = new Clock();
  private delta = 0;

  private pooledItem = <Array<Object3D>>[];
  private amountToPool = 200;

  private remainingMissilesinPool = 0;

  async load() {
    let materialArray = [];
    let texture_ft = new TextureLoader().load(
      "./assets/skybox/purplenebula/purplenebula_ft.png"
    );
    let texture_bk = new TextureLoader().load(
      "./assets/skybox/purplenebula/purplenebula_bk.png"
    );
    let texture_up = new TextureLoader().load(
      "./assets/skybox/purplenebula/purplenebula_up.png"
    );
    let texture_dn = new TextureLoader().load(
      "./assets/skybox/purplenebula/purplenebula_dn.png"
    );
    let texture_rt = new TextureLoader().load(
      "./assets/skybox/purplenebula/purplenebula_rt.png"
    );
    let texture_lf = new TextureLoader().load(
      "./assets/skybox/purplenebula/purplenebula_lf.png"
    );
    materialArray.push(new MeshBasicMaterial({ map: texture_ft }));
    materialArray.push(new MeshBasicMaterial({ map: texture_bk }));
    materialArray.push(new MeshBasicMaterial({ map: texture_up }));
    materialArray.push(new MeshBasicMaterial({ map: texture_dn }));
    materialArray.push(new MeshBasicMaterial({ map: texture_rt }));
    materialArray.push(new MeshBasicMaterial({ map: texture_lf }));

    for (let i = 0; i < 6; i++) materialArray[i].side = BackSide;

    let skyBoxGeo = new BoxGeometry(1000, 1000, 2000);
    let skyBox = new Mesh(skyBoxGeo, materialArray);
    this.add(skyBox);

    // Import the Fighter Jet
    const fighterJetData = await this.glbLoader.loadAsync(
      "./assets/fighter-jet.glb"
    );
    this.fighterJet = fighterJetData.scene;

    // Import the Missile
    const missileJetData = await this.glbLoader.loadAsync(
      "./assets/missile.glb"
    );
    this.missile = missileJetData.scene;
  }
  initialize() {
    const ambient = new AmbientLight(0xffffff, 0.5);
    this.add(ambient);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 40, 0);
    this.add(light);

    this.fighterJet.position.set(0, -0.5, -3);
    this.fighterJet.scale.set(0.06, 0.06, 0.06);
    this.add(this.fighterJet);

    document.onkeydown = (e) => {
      if (e.key === " ") {
        this.fireMissiles();
      }
    };

    this.poolMissiles();
    (
      document.querySelector(".amount-to-pool") as HTMLElement
    ).innerHTML = `${this.amountToPool}`;

    (document.querySelector(".shoot-button") as HTMLButtonElement).onclick =
      () => {
        this.fireMissiles();
      };
  }

  update() {
    this.delta = this.clock.getDelta();
    this.fighterJet.rotation.y -= 0.5 * this.delta;

    this.moveMissile();
    this.resetMisile();

    this.getRemainingMissileInPool();
    (
      document.querySelector(".remaining-pool-item") as HTMLElement
    ).innerHTML = `${this.remainingMissilesinPool}`;
  }

  private poolMissiles() {
    for (let i = 0; i < this.amountToPool; i++) {
      const missile = this.missile.clone();
      missile.scale.set(0.15, 0.15, 0.15);
      missile.position.set(0, 0, 0);
      missile.visible = false;
      this.pooledItem.push(missile);
      this.add(missile);
    }
  }

  private getPooledMissile() {
    for (let i = 0; i < this.amountToPool; i++) {
      if (!this.pooledItem[i].visible) {
        return this.pooledItem[i];
      }
    }
    return null;
  }

  private fireMissileOne() {
    const missile = this.getPooledMissile();
    if (missile) {
      this.fighterJet.attach(missile);
      missile.position.set(5.6, 3.29, 5);
      missile.scale.set(0.15, 0.15, 0.15);
      missile.rotation.set(0, 0, 0);
      missile.visible = true;
      this.attach(missile);
    }
  }
  private fireMissileTwo() {
    const missile = this.getPooledMissile();
    if (missile) {
      this.fighterJet.attach(missile);
      missile.position.set(3.2, 3.29, 5);
      missile.scale.set(0.15, 0.15, 0.15);
      missile.rotation.set(0, 0, 0);
      missile.visible = true;
      this.attach(missile);
    }
  }
  private fireMissileThree() {
    const missile = this.getPooledMissile();
    if (missile) {
      this.fighterJet.attach(missile);
      missile.position.set(-5.6, 3.29, 5);
      missile.scale.set(0.15, 0.15, 0.15);
      missile.rotation.set(0, 0, 0);
      missile.visible = true;
      this.attach(missile);
    }
  }
  private fireMissileFour() {
    const missile = this.getPooledMissile();
    if (missile) {
      this.fighterJet.attach(missile);
      missile.position.set(-3.2, 3.29, 5);
      missile.scale.set(0.15, 0.15, 0.15);
      missile.rotation.set(0, 0, 0);
      missile.visible = true;
      this.attach(missile);
    }
  }

  private fireMissiles() {
    this.fireMissileOne();
    this.fireMissileTwo();
    this.fireMissileThree();
    this.fireMissileFour();
  }

  private moveMissile() {
    for (let i = 0; i < this.amountToPool; i++) {
      if (this.pooledItem[i].visible) {
        this.pooledItem[i].translateZ(-2 * this.delta);
      }
    }
  }

  private resetMisile() {
    for (let i = 0; i < this.pooledItem.length; i++) {
      if (
        this.pooledItem[i].position.x > 10 ||
        this.pooledItem[i].position.x < -10 ||
        this.pooledItem[i].position.z > 10 ||
        this.pooledItem[i].position.z < -10
      ) {
        this.pooledItem[i].visible = false;
        this.pooledItem[i].position.set(0, 0, 0);
      }
    }
  }
  private getRemainingMissileInPool() {
    const remaining = this.pooledItem.filter((eachMissile) => {
      return !eachMissile.visible;
    });
    this.remainingMissilesinPool = remaining.length;
  }
}
