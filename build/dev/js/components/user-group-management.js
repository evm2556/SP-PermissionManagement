const Home = Vue.component('user-group-management', {
  template:'#user-group-management',
  mixins: [app_data, app_helper],
  props: {
    siteCollection: {
      type: Object,
      default: function(){
        return {
          title: '',
          url:  ''
        }
      }
    },
    isSiteCollectionSelected: {
      type: Boolean,
      default: false
    },
    type: {
      type: Object,
      default: function(){
        return {users: true, groups: false}
      }
    }
  },
  watch: {
    isSiteCollectionSelected: {
      handler: function(){
        console.log(this.isSiteCollectionSelected);
      }
    },
    siteCollection: {
      handler: function(newVal, oldVal){
      if(this.siteCollection == null){
        return;
      }
        this.getData();
    },
    deep: true
  },
  type: {
    handler: function(newVal, oldVal){
        if(this.isSiteCollectionSelected){
          this.getData();
        }
    },
    deep: true
  }
  },
  data: function() {
    return {
      drawer: false,
      toggle_select: 0,
      isSaving: false,
      isLoading: false,
      saveProgress: 0,
      savingIndex: 0,
      updateProgressInterval: false,
      selectedItem: false,
      snackbar: {
        show: false,
        y: 'top',
        x: 'right',
        mode: '',
        timeout: 6000,
        text: 'Data loaded successfully'
      },
      items: [{displayName:'Foo Bar', loginname: 'foo.bar', email: 'foo.bar@example.com'},{displayName:'Joe Schmoe', loginname: 'joe.schmoe', email: 'joe.schmoe@example.com'},],
      availableItems: [
        {title: 'Perm1', subtitle: "", selected: false },
        {title: 'Perm2', subtitle: "", selected: false },
        { title: 'Perm3', subtitle: "", selected: false }
      ],
      assignedItems:[
        {title: 'Perm4', subtitle: "", selected: false },
        {title: 'Perm5', subtitle: "", selected: false },
        { title: 'Perm6', subtitle: "", selected: false }
      ],
      originalAssignedItems:[],
      newItems: [],
      messages: [],
      selectedAvailable: {},
      selectedAssigned: {},
      actions: {
        Starting: 'Starting',
        Finished: 'Finished',
        Failed: 'Failed',
        Success: 'Success'
      }
    };
  },
  methods: {
    getData: function(){
      this.isLoading = true;
      (function(that){
      new Promise(function(resolve, reject){
          that.messages.push({date: new Date(), verb: that.actions.Starting, text: 'Fetching Users', target: that.siteCollection.title, url: that.siteCollection.url, type: 'warning'});
          that.getUsers(function(data){
            that.messages.push({date: new Date(), verb: that.actions.Finished, text:  'Fetching Users', target: that.siteCollection.title, url: that.siteCollection.url, type: 'info'});
            resolve();
          }, function(error){
            that.messages.push({date: new Date(), verb: that.actions.Failed, text:  'Fetching Users',  hasError: true, error: error.message, target: that.siteCollection.title, url: that.siteCollection.url, type: 'error'});
              that.isLoading = false;

          });
      }).then(function(result){
        return new Promise(function(resolve, reject){
          that.messages.push({date: new Date(), verb: that.actions.Starting, text: 'Fetching Groups', target: that.siteCollection.title, url: that.siteCollection.url, type: 'warning'});
            that.getGroups(function(data){
              that.messages.push({date: new Date(), verb: that.actions.Finished, text:  'Fetching Groups', target: that.siteCollection.title, url: that.siteCollection.url, type: 'info'});
              resolve();
            }, function(error){
              that.messages.push({date: new Date(), verb: that.actions.Failed, text:  'Fetching Groups', hasError: true, error: error.message, target: that.siteCollection.title, url: that.siteCollection.url, type: 'error'});
                that.isLoading = false;
            });
        })
      }).then(function(result){
        that.isLoading = false;
        that.$emit('site-collection-selected', true);
      });
    })(this);
    },
    getUsers: function(callback, errorCallback){
      (function(that){
        setTimeout(function(){
          //populate items for current type and populate availabe items for the opposing type
          //re-select previously selected item if its available
          //trigger select change for selected item if it exists, else clear selected item
          var rand = 0;

            return rand == 0 ? errorCallback({message: 'Bad Stuff Happened'}) : callback(true);

        },1000);
      })(this);
    },
    getGroups: function(callback, errorCallback){
      (function(that){
        setTimeout(function(){
          //populate items for current type and populate availabe items for the opposing type
          //re-select previously selected item if its available
          //trigger select change for selected item if it exists, else clear selected item
              var rand = Math.random();
            return rand == 0 ? errorCallback({message: 'Bad Stuff Happened'}) : callback(true);

        },1000);
      })(this);
    },
    clearSelected: function(type){
      var key;
      var selectedItems = type == 'available' ? this.selectedAvailable : this.selectedAssigned;
      var items = type == 'available' ? this.availableItems : this.assignedItems;
      for(key in selectedItems){
        items[selectedItems[key].index].selected = false;
        delete selectedItems[key];
      }
    },
    itemChanged: function(item){
      var i;
      this.selectedItem = item.displayName.length > 0 ? item : false;
      i = this.assignedItems.length;
      while(i--){
            this.originalAssignedItems.push(JSON.parse(JSON.stringify(this.assignedItems[i])));
      }
      if(this.selectedItem){
        this.getItem();
      }
    },
    getItem: function(){
        this.messages.push({date: new Date(), verb: this.actions.Starting, text: 'Fetching ' + (this.type.users ? 'Groups' : 'Users'), preposition: 'for', target: this.selectedItem.displayName, type: 'warning'});
        this.isLoading = true;
        (function(that){
          setTimeout(function(){
            that.messages.push({date: new Date(), verb: that.actions.Finished, text: 'Fetching ' + (that.type.users ? 'Groups' : 'Users'), preposition: 'for', target: that.selectedItem.displayName, type: 'info'});
            that.isLoading = false;
          },1000);
        })(this);
    },
    selectItem: function(type, item, index){
      var selectedItems = type == 'available' ? this.selectedAvailable : this.selectedAssigned;
      var items = type == 'available' ? this.availableItems : this.assignedItems;
      items[index].selected = !items[index].selected;
      if(  items[index].selected){
        selectedItems[item.title] =  items[index];
        //set index so we can easily find this item when we "give/remove" it
        selectedItems[item.title].index = index;
      } else {
        delete selectedItems[item.title];
      }
    },
    giveAll: function(sourceType){
      var sourceSelectedItems;
      var targetSelectedItems;
      var sourceItems;
      var key;
      var index = 0;
      var targetItems;
      var isOriginalItem;
      var itemIndex;
      var newItemIndex;
      var i;
      if(sourceType == 'available'){
        sourceSelectedItems = this.selectedAvailable;
        targetSelectedItems = this.selectedAssigned;
        sourceItems = this.availableItems;
        targetItems =  this.assignedItems;
      } else {
        sourceSelectedItems = this.selectedAssigned;
        targetSelectedItems = this.selectedAvailable;
        sourceItems = this.assignedItems;
        targetItems =  this.availableItems;
      }
      if(sourceType == 'assigned'){
        this.newItems = [];
      }
      //move items from selected into target lists
      i = sourceItems.length;
      while(i--){
        //push item to target
        sourceItems[i].selected = false;
        targetItems.push(JSON.parse(JSON.stringify(sourceItems[i])));
        itemIndex = _.findIndex(this.originalAssignedItems, function(o){
          return o.title == sourceItems[i].title
        });
        isOriginalItem = itemIndex > -1;
        if(isOriginalItem && sourceType =='assigned' || !isOriginalItem && sourceType == 'available'){
          this.newItems.push(JSON.parse(JSON.stringify(sourceItems[i])));
          this.newItems[this.newItems.length - 1].operation = sourceType == 'available' ? 'add' : 'delete';
        } else {
            newItemIndex = _.findIndex(this.newItems, function(o){
              return o.title == sourceItems[i].title
            });
             this.newItems.splice(newItemIndex, 1);
        }
        sourceItems.splice(i, 1);
      }


      //merge the selected items into the target selected items (maintains previously selected items)
//      targetSelectedItems = Object.assign(targetSelectedItems, sourceSelectedItems);
      //now that the target selected items are merged, delete
      //index = targetItems.length - Object.keys(sourceSelectedItems).length;
      for(key in sourceSelectedItems){
    //    targetSelectedItems[key].index = _.findIndex(targetItems, function(o) { return o.title == key});
        delete sourceSelectedItems[key];
      //  index++;
      }
    },
    giveSelected: function(sourceType){
      var sourceSelectedItems;
      var targetSelectedItems;
      var sourceItems;
      var isOriginalItem = false;
      var key;
      var index = 0;
      var itemIndex;
      var newItemIndex;
      var targetItems;
      var modIndex = 0;
      var indexRemovedArr = [];
      if(sourceType == 'available'){
        sourceSelectedItems = this.selectedAvailable;
        targetSelectedItems = this.selectedAssigned;
        sourceItems = this.availableItems;
        targetItems =  this.assignedItems;
      } else {
        sourceSelectedItems = this.selectedAssigned;
        targetSelectedItems = this.selectedAvailable;
        sourceItems = this.assignedItems;
        targetItems =  this.availableItems;
      }

      //move items from selected into target lists
      for(key in sourceSelectedItems){
            sourceItems[sourceSelectedItems[key].index].selected = false;
        //push item to target
        targetItems.push(JSON.parse(JSON.stringify(sourceItems[sourceSelectedItems[key].index])));
        //delete targetItems[targetItems.length -1].index;
        itemIndex = _.findIndex(this.originalAssignedItems, function(o){
          return o.title == sourceSelectedItems[key].title
        });
        isOriginalItem = itemIndex > -1;
        if(isOriginalItem && sourceType =='assigned' || !isOriginalItem && sourceType == 'available'){
          this.newItems.push(JSON.parse(JSON.stringify(sourceItems[sourceSelectedItems[key].index])));
          this.newItems[this.newItems.length - 1].operation = sourceType == 'available' ? 'add' : 'delete';
        } else {
          newItemIndex = _.findIndex(this.newItems, function(o){
            return o.title == sourceSelectedItems[key].title
          });
           this.newItems.splice(newItemIndex, 1);
        }
      }

      for(key in sourceSelectedItems){
        //remove item from source
        modIndex = _.filter(indexRemovedArr, function(indexNum){ return indexNum < sourceSelectedItems[key].index }).length;
        sourceItems.splice(sourceSelectedItems[key].index - modIndex, 1);
        indexRemovedArr.push(sourceSelectedItems[key].index);
      }

      //merge the selected items into the target selected items (maintains previously selected items)
  //    targetSelectedItems = Object.assign(targetSelectedItems, sourceSelectedItems);
    //  index = targetItems.length - Object.keys(sourceSelectedItems).length;
      for(key in sourceSelectedItems){
    //    targetSelectedItems[key].index = index;
        delete sourceSelectedItems[key];
        index++;
      }
    },
    save: function(){
      this.isSaving = true;
      this.saveProgress = 0;
      this.messages.push({date: new Date(), verb: this.actions.Starting, text: 'Saving ' + (this.type.users ? 'Groups' : 'Users'), target: this.selectedItem.displayName, type: 'warning'});
      this.saveIndex = 0;
      (function(that){
        that.updateProgressInterval = setInterval(function(){
          that.saveProgress += 100/that.newItems.length;
          var operationText = that.newItems[that.saveIndex].operation.charAt(0).toUpperCase() +  that.newItems[that.saveIndex].operation.slice(1);
          var preposition = that.newItems[that.saveIndex].operation == 'add' ? 'to' : 'from';
          that.messages.push({date: new Date(), verb: that.actions.Success, text:operationText + ' ' + that.newItems[that.saveIndex].title, preposition: preposition, target: that.selectedItem.displayName,type: 'success'});
          that.saveIndex++;
          if(that.saveProgress >= 100){
            that.isSaving = false;
            that.messages.push({date: new Date(), verb: that.actions.Finished, text: 'Saving' + (that.type.users ? 'Groups' : 'Users'), preposition: 'for', target: that.selectedItem.displayName,type: 'info'});
            that.newItems = [];
            clearInterval(  that.updateProgressInterval);
            //update originating Items
            var i = 0;
            that.originalAssignedItems = [];
            that.newItems = [];
            for(i = 0; i < that.assignedItems.length; i++){
              that.originalAssignedItems.push(JSON.parse(JSON.stringify(that.assignedItems[i])));
            }
          }
        }, 100);
      })(this);
    },
    clearConsole: function(){
      this.messages = [];
    }
  },
  created: function(){
    this.toggle_select = this.type.users ? 0 : 1;
  }
});
