// ============================ DB STUFF ============================
const db_settings = { outfmt: 'json', dbgroup: '_postgres' };

function ps_tags_select_all() {
   console.log("Kas par tagiem?");
   return new Promise(resolve => {
      runSql('tags_select_all', {}, db_settings, function (results) {
         if (results.statusCode !== 200) {
            console.info(`Nesanāca`);
            resolve(false);
         }
         resolve(results.responseJson);
      });
   });
};

function ps_tags_insert(tagname) {
   tagname = `${tagname}`;
   return new Promise(resolve => {
      runSql('tags_insert', { tagname }, db_settings, function (results) {
         resolve(results.statusCode === 200);
      });
   });
};


// ============================ PROXY ============================
let allTags = {};

const TAGS = new Proxy(allTags, {
   get(target, name) {
      if (name in target) return target[name];

      console.warn(`updating the database to include something like ${name}`);
      ps_tags_insert(name);
   }
});

// resaving tag data from database into the object
async function updateTagsObject() {
   const allTagsData = await ps_tags_select_all();
   if (allTagsData.length) {
      allTagsData.forEach(tagrow => {
         const { tagname, tagvalue } = tagrow;
         if (tagname === null || tagname === 'null' || tagname === "") return;

         TAGS[tagname] = tagvalue;
      });
   };
}
