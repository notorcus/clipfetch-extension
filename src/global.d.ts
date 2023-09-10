// global.d.ts
declare var CSInterface: any;

declare namespace CEP {
    interface FS {
      stat(filePath: string): { err: number };
      // You can add more methods and properties of the cep.fs module if needed.
    }
  }
  
  interface Window {
    cep: {
      fs: CEP.FS;
    };
  }