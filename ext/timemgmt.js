/* globals roam42, chrono */

(() => {
  roam42.timemgmt = {};
  roam42.timemgmt.smartBlocks = {};
  roam42.timemgmt.smartBlocks.commands = {};
  
  roam42.timemgmt.getAllTasks = async ()=>{
    //returns array with format [{"uid":"","string":""},{"title":"","uid":""}] first is task, second is parent of task
    var todoUIDs = [];
    for(var task of await roam42.common.getBlocksReferringToThisPage('TODO')) 
        todoUIDs.push(task[0].uid)
    return await roam42.common.getPageNamesFromBlockUidList(todoUIDs);
  }
  
  // DUE TODAY FUNCTIONS
  roam42.timemgmt.todosDueToday = async (limitOutputCount = 50)=>{
    var todayDate = roam42.dateProcessing.parseTextForDates('today');
    var outputTODOs = [];
    var outputCounter = 1;
    for(var task of await roam42.timemgmt.getAllTasks()) {
      var taskString = task[0].string + ' ';
      if(taskString.substring(0,12)!='{{[[query]]:') { 
        if(outputCounter < limitOutputCount && taskString.includes('{{[[TODO]]}}') && taskString.includes(todayDate)) {
          outputCounter += 1;
          outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title})
        }
      }
    }    
    return outputTODOs;
  }
  
  // DUE TODAY Used in menu to directly insert TODOS
  roam42.timemgmt.smartBlocks.todosDueToday = async ()=> {
    for(var task of await roam42.timemgmt.todosDueToday()) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    await roam42.smartBlocks.outputArrayWrite()
  }

  // DUE TODAY COMMAND to use in workflow
  roam42.timemgmt.smartBlocks.commands.todosDueToday = async (limitOutputCount = 50)=> {
    var firstBlock = '';
    for(var task of await roam42.timemgmt.todosDueToday(limitOutputCount))
      if(firstBlock=='')
        firstBlock = `((${task.taskUID}))`;
      else
        await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    return firstBlock;
  }

  // OVERDUE Used in menu to directly insert TODOS
  roam42.timemgmt.smartBlocks.todosOverdue = async ()=> {
    for(var task of await roam42.timemgmt.todosOverdue(100,true,false)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with Overdue TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }

  // OVERDUE COMMAND to use in workflow
  roam42.timemgmt.smartBlocks.commands.todosOverdue = async (limitOutputCount = 50, includeDNP=false)=> {
    var firstBlock = '';
    for(var task of await roam42.timemgmt.todosOverdue(limitOutputCount,true,includeDNP)) 
      if(firstBlock=='')
        firstBlock = `((${task.taskUID}))`;
      else
        await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    return firstBlock;
    
  }
  

  roam42.timemgmt.smartBlocks.todosOverduePlusDNP = async ()=> {
    for(var task of await roam42.timemgmt.todosOverdue(100,true,true)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with Overdue+DNP TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }

  // FUTURE Used in menu to directly insert TODOS  
  roam42.timemgmt.smartBlocks.todosFuture = async ()=> {
    for(var task of await roam42.timemgmt.todosFuture(100,true,false)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with Overdue TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }
  
  roam42.timemgmt.smartBlocks.todosFuturePlusDNP = async ()=> {
    for(var task of await roam42.timemgmt.todosFuture(100,true,true)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);   
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with Overdue+DNP TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }  
  
  // FUTURE COMMAND to use in workflow
  roam42.timemgmt.smartBlocks.commands.todosFuture = async (limitOutputCount = 50, includeDNP=false)=> {
    var firstBlock = '';
    for(var task of await roam42.timemgmt.todosFuture(limitOutputCount,true,includeDNP)) 
      if(firstBlock=='')
        firstBlock = `((${task.taskUID}))`;
      else
        await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    return firstBlock;        
  }  

  // UNDATED
  roam42.timemgmt.smartBlocks.todoNotDated = async ()=> {
    for(var task of await roam42.timemgmt.todoNotDated(100)) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    if(roam42.smartBlocks.activeWorkflow.arrayToWrite.length>10) {
      if(confirm("Would you like to insert " + roam42.smartBlocks.activeWorkflow.arrayToWrite.length + " blocks refs with undated TODOS?"))
        await roam42.smartBlocks.outputArrayWrite()
    } else 
        await roam42.smartBlocks.outputArrayWrite()
  }
  
  // UNDATED COMMAND to use in workflow
  roam42.timemgmt.smartBlocks.commands.todoNotDated = async (limitOutputCount = 50)=> {
    var firstBlock = '';
    for(var task of await roam42.timemgmt.todoNotDated(limitOutputCount)) 
      if(firstBlock=='')
        firstBlock = `((${task.taskUID}))`;
      else
        await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);  
    return firstBlock;        
    
  }    
  
  
  roam42.timemgmt.todosOverdue = async (limitOutputCount = 50, sortAscending=true, includeDNPTasks=true)=>{
    var yesterday = chrono.parseDate('yesterday');
    var outputTODOs = [];
    var outputCounter = 1;
    
    //STEPS: (1) loop through each tag to see if it is a date before today (2) Also check if page name is dated
    for(var task of await roam42.timemgmt.getAllTasks()) {
      if(outputCounter < limitOutputCount) {
        var taskWasOutputted=false; //tracks for this loop if thee was an output
        var testForPages=null;
        var taskString = task[0].string + ' '; 
        if(taskString.substring(0,12)!='{{[[query]]:') { 
          if(taskString.includes('{{[[TODO]]}}')) //confirm there is a TODO in the string properly formatted
            testForPages = taskString.replace('[[TODO]]','').match(/\[\[(\s*[\S\s]*?)\]\]/g)
          if(testForPages!=null) {
            for(let page of testForPages) {
              try {
                var testForDate =  roam42.dateProcessing.testIfRoamDateAndConvert(page);
                if(testForDate && testForDate <= yesterday) {
                  outputCounter+=1;
                  taskWasOutputted=true;
                  outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title, date:testForDate})
                }                 
              } catch(e) {}
            }
          } //end of testForPages!=null
        }
        //This task has no date, but check if it is on a DNP, thus inherits the date
        if(includeDNPTasks && taskWasOutputted==false) {          
          try {
            var pageNameIsDate = roam42.dateProcessing.testIfRoamDateAndConvert(task[1].title);
            if(pageNameIsDate && pageNameIsDate <= yesterday) {
                  outputCounter+=1;
                  outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title, date:pageNameIsDate })
            }            
          } catch(e) {}
        } //end of includeDNPTasks
      } // end outputCounter < limitOutputCount
    } //end of for
    return outputTODOs.sort((a, b) =>  a.pageTitle-b.pageTitle ).
                       sort((a, b) => sortAscending ? a.date-b.date : b.date-a.date );
  }
  
  roam42.timemgmt.todosFuture = async (limitOutputCount = 50, sortAscending=true, includeDNPTasks=true)=>{
    var tomorrow = chrono.parseDate('tomorrow');
    var outputTODOs = [];
    var outputCounter = 1;
    //STEPS: (1) loop through each tag to see if it is a date before today (2) Also check if page name is dated
    for(var task of await roam42.timemgmt.getAllTasks()) {
      if(outputCounter < limitOutputCount) {
        var taskWasOutputted=false; //tracks for this loop if thee was an output
        var testForPages=null;
        var taskString = task[0].string + ' '; 
        if(taskString.substring(0,12)!='{{[[query]]:') { 
          if(taskString.includes('{{[[TODO]]}}')) //confirm there is a TODO in the string properly formatted
            testForPages = taskString.replace('[[TODO]]','').match(/\[\[(\s*[\S\s]*?)\]\]/g)
          if(testForPages!=null) {
            for(let page of testForPages) {
              try {
                var testForDate = roam42.dateProcessing.testIfRoamDateAndConvert(page);
                if(testForDate && testForDate >= tomorrow) {
                  outputCounter+=1;
                  taskWasOutputted=true;
                  outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title, date:testForDate})
                }                 
              } catch(e) {}
            }
          } //end of testForPages!=null
        }
        //This task has no date, but check if it is on a DNP, thus inherits the date
        if(includeDNPTasks && taskWasOutputted==false) {         
          try {
            var pageNameIsDate = roam42.dateProcessing.testIfRoamDateAndConvert(task[1].title);
            if(pageNameIsDate && pageNameIsDate >= tomorrow) {
                  outputCounter+=1;
                  outputTODOs.push({taskUID: task[0].uid, pageTitle: task[1].title, date:pageNameIsDate })
            }            
          } catch(e) {}
        } //end of includeDNPTasks
      } // end outputCounter < limitOutputCount
    } //end of for
    return outputTODOs.sort((a, b) =>  a.pageTitle-b.pageTitle ).
                       sort((a, b) => sortAscending ? a.date-b.date : b.date-a.date );
  }  
  
  roam42.timemgmt.todoNotDated = async (limitOutputCount = 100)=>{
    var outputTODOs = [];
    var outputCounter = 1;
    for(var task of await roam42.timemgmt.getAllTasks()) {
      var taskString = task[0].string + ' ';
      if(taskString.substring(0,12)!='{{[[query]]:') { 
        var testForPages = taskString.replace('[[TODO]]','').replace('[[TODO]]','').match(/\[\[(\s*[\S\s]*?)\]\]/g)
        var todoContainsDate = false;
        if(testForPages) {
          for(let page of testForPages) {
            try {
              var testForDate = roam42.dateProcessing.testIfRoamDateAndConvert(page);
              if(testForDate) 
                todoContainsDate = true              
            } catch(e) {}
          }
        } // end of first IF
        // console.log(todoContainsDate)
        if(outputCounter < limitOutputCount && todoContainsDate==false){
          outputCounter+=1;
          var taskString = task[0].string.replace('{{[[TODO]]}}','').trim();
          outputTODOs.push({taskUID: task[0].uid, taskSort:taskString, pageTitle: task[1].title})
        }
        todoContainsDate = false;
      }
    } //end of for
    return outputTODOs.sort((a, b) => a.taskSort.localeCompare(b.taskSort));
  }  
  
  window.roam42.timemgmt.testingReload = () => {
    roam42.loader.addScriptToPage( "timemgmt", roam42.host + 'ext/timemgmt.js');
    setTimeout(async ()=>{
      // console.clear()
      // console.log(await roam42.timemgmt.todoNotDated(25))
    },2000)
  };
})();

(() => {
  roam42.q = {};
  roam42.q.smartBlocks = {};
  roam42.q.smartBlocks.commands = {};
  
  var tagQuery = async (pageRef)=>{
    var results = [];
    for(var block of await roam42.common.getBlocksReferringToThisPage(pageRef)) 
      results.push({uid: block[0].uid, text:block[0].string})
    return results
  }
  
  var stripToPageName = async (pageName)=>{
    //removes possible leading and trailing characters for a page name
    if(pageName.substring(0,1)=="#") pageName = pageName.substring(1,pageName.length);
    if(pageName.substring(0,2)=="[[") 
      if(pageName.substring(pageName.length-2,pageName.length)=="]]") 
          pageName = pageName.substring(2, pageName.length-2);
    return pageName;
  }
  
  //return blocks that reference all the included references
  //pageRefString comma delimited list of page refs
  roam42.q.blockMentions = async (pageRefString, limitOutputCount = 1000)=> {
    var results = [];
    var tokens = pageRefString.split(',')
    var outputCounter = 1;
    if( pageRefString.trim() != '' && tokens.length>0) {
      var firstPage = await stripToPageName(tokens[0]);   //grab first block
      if(tokens.length>1) tokens.shift() //remove first element
      for(var block of await tagQuery(firstPage)) {
        if(outputCounter < limitOutputCount ) {
          var bIncludeRef = true;
          var blockText = block.text.toLowerCase();
          for(var t of tokens) {
            var tokenText = t.toLowerCase(); 
            if(tokenText.substring(0,1)=='-') {
              var searchFor = tokenText.substring(1,tokenText.length);
              if(blockText.includes(searchFor)) bIncludeRef = false;                        
            }
            else
              if(!blockText.includes(tokenText)) bIncludeRef = false;
          }
          if(bIncludeRef==true) {
            results.push(block);
            outputCounter+=1;
          }
        }
      } //end for      
    }
    return results;
  }
  
  roam42.q.smartBlocks.blockMentions = async()=> {
    var requestString = prompt('input')
    if(requestString == null) return;
    var query = await roam42.q.blockMentions(requestString);
    if(query.length>50 && confirm(`There are ${query.length+1} blocks matching your request. Continue with inserting blocks?`)==false) return;      
    for(var block of query) 
      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${block.uid}))`);   
    await roam42.smartBlocks.outputArrayWrite()    
  }

  roam42.q.smartBlocks.commands.blockMentions = async (requestString)=> {
    var limitOutputCount = Number(requestString.substring(0,requestString.search(',')));
    var queryParameters = requestString.substring(requestString.search(',')+1,requestString.length);
    var firstBlock = '';
    for(var block of await roam42.q.blockMentions(queryParameters,limitOutputCount+1)) {
      if(firstBlock=='')
        firstBlock = `((${block.uid}))`;
      else
        await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${block.uid}))`);  
    }
    return firstBlock;
  }
  
  
  // setTimeout(async ()=>{
    // console.clear()
    //  var y = await roam42.q.blockMentions('toRead,todo,via')
    //   console.log(y)
    //      await roam42.smartBlocks.activeWorkflow.outputAdditionalBlock(`((${task.taskUID}))`);       
  // }, 1000)
  
  
})();