import fs from 'fs';

class Repository{
    public async readStorage(): Promise<string> {
    try {
     return await fs.promises.readFile('./storeFile.json', 'utf-8');
      
    } catch (err) {
        return "err";
        
    }
  }
  public  async updateStorage(updatedData: string): Promise<void> {
    try {
      
       await fs.promises.writeFile('./storeFile.json', JSON.stringify(updatedData));
       
    } catch (err) {
        return;
    }
  }
}
 export default Repository