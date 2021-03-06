import 'bootstrap';
const $ = require( 'jquery' ); // make eslint happy
import 'trumbowyg';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import AdminHome from './pages/AdminHome';
// import AdminCourses from './pages/AdminCourses';
// import AdminCourse from './pages/AdminCourse';
// import AdminUnit from './pages/AdminUnit';
// import AdminFeedback from './pages/AdminFeedback';
// import AdminGlossary from './pages/AdminGlossary';

$(document).ready(function(){ // eslint-disable-line no-undef 

	$.trumbowyg.svgPath = '/public/icons.svg';

	// pageUIType is appended to body by page template
	// here it is used to determine which ui functions to load on the page
	// they are all here to facilitate moving to a frontend framework 

	let pageType = $('body').data('pageUiType');
	switch(pageType){
		
	case 'ADMIN_COURSES':

		// ReactDOM.render(
		// 	<AdminCourses breadCrumbs = {[{title:'Admin', url: '/admin'}, {title:'Courses', url: '/admin/courses'}]} activeNavItem = {'Courses'} />,
		// 	document.getElementById('root')// eslint-disable-line no-undef       
		// ); 

		$('#addCourse').submit(function(e){
			e.preventDefault();
			var data = {};
			data.name = $('#courseName').val();
			data.description = $('#courseDescription').val();
			data.order = $('#courseOrder').val()||99;
			$.ajax({
				type: 'POST',
				url: '/api/courses',
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);  // eslint-disable-line no-undef                 
				}
			});
		});

		$('#courseDeleteModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#courseToDeleteName').text(button.data('courseName'));
			modal.find('#courseDeleteConfirm').on('click', function(){
				var url = '/api/courses/' + button.data('courseId');
				$.ajax({
					type: 'DELETE',
					url: url,
					dataType: 'json',
					async: true,
					success: function (){
						location.reload(true); // eslint-disable-line no-undef   
					}
				});
			});
		});

		$('#courseDeleteModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#courseDeleteConfirm').off('click');
		});

		break;

	case 'ADMIN_COURSE':{
		// let id = $('body').data('courseId');
		// let title = $('body').data('courseTitle');

		// ReactDOM.render(
		// 	<AdminCourse breadCrumbs = {[{title:'Admin', url: '/admin'}, {title:'Courses', url: '/admin/courses'}, 	{title:title, url: '/admin/courses/' + id },
		// 	]} activeNavItem = {'Courses'} courseTitle = {title} _id={id} />,
		// 	document.getElementById('root')// eslint-disable-line no-undef       
		// ); 

		$('#unitDeleteModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#unitToDeleteName').text(button.data('unitName'));
			modal.find('#unitDeleteConfirm').on('click', function(e){
				e.preventDefault();
				var url = '/api/courses/' + button.data('courseId') + '/units/' + button.data('unitId');
				$.ajax({
					type: 'DELETE',
					url: url,
					dataType: 'json',
					async: true,
					success: function (){
						location.reload(true); // eslint-disable-line no-undef 
					}
				});
			});
		});

		$('#updateName').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId');
			var	data = {
				name: $('#newTitle').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true); // eslint-disable-line no-undef                    
				}
			});
		});

		$('#updateDescription').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId');
			var data = {
				description: $('#newDescription').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                 
				}
			});
		});		
		$('#updateCourseImages').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId');
			var data = {
				courseImageUrl: $('#newMainImageURL').val(),
				courseThumbImageUrl: $('#newThumbImageURL').val()
			};
			
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true); // eslint-disable-line no-undef    
				}
			});
		});

		$('#updateOrder').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId');
			var data = {
				order: $('#newOrder').val()
			};

			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef               
				}
			});
		});
    
		$('#updateStatus').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId');
			var data = {
				published: !$(this).data('publish')
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                
				}
			});
		});

		$('#addUnit').submit(function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + '/units';
			var data = {
				name: 			$('#unitName').val(),
				description:	$('#unitDescription').val(),
				order:			$('#unitOrder').val() || 99
			};

			$.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef            
				}
			});
		});

		break;
	}

	case 'ADMIN_LEADERBOARD':{

		$('#userRefreshConfirm').on('click', function(e){
			e.preventDefault();
			var url = '/api/users/refresh';
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				async: true,
				success: function (){
					location.reload(true);
				}
			});
      
		});
		break;
	}

	case 'ADMIN_FEEDBACK':{
		// ReactDOM.render(
		// 	<AdminFeedback breadCrumbs = {[{title:'Admin', url: '/admin'}, {title:'Feedback', url: '/admin/feedback'}]}
		// 		activeNavItem = {'Feedback'} 
		// 	/>,
		// 	document.getElementById('root')// eslint-disable-line no-undef       
		// );

		$('#feedbackDeleteModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#feedbackToDeleteName').text(button.data('feedbackName'));
			modal.find('#feedbackDeleteConfirm').on('click', function(){
				var url = '/api/feedback/' + button.data('feedbackId');
				$.ajax({
					type: 'DELETE',
					url: url,
					dataType: 'json',
					async: true,
					success: function (){
						location.reload(true); // eslint-disable-line no-undef 
					}
				});
			});
		});

		$('#feedbackDeleteModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#feedbackDeleteConfirm').off('click');
		});

		$('#updateStatusModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget);
			var modal = $(this);
			modal.find('#toggleStatus').on('click', function(){
				var url = '/api/feedback/' + button.data('feedbackId');
				var data = {
					published: !$(button).data('publish')
				};
				$.ajax({
					type: 'PUT',
					url: url,
					dataType: 'json',
					async: true,
					data: data,
					success: function (){
						location.reload(true);  // eslint-disable-line no-undef       
					}
				});
			});
		});

		break;
	}



	case 'ADMIN_HOME':

		// ReactDOM.render(
		// 	<AdminHome />,
		// 	document.getElementById('root')// eslint-disable-line no-undef       
		// ); 

		break;
	case 'ADMIN_USER':

		$('#updateName').on('click', function(e){
			e.preventDefault();
			var url = '/api/users/' + $(this).data('userId');
			var data = {
				firstName: $('#newFirstName').val(),
				lastName: $('#newLastName').val()
			};

			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true); // eslint-disable-line no-undef               
				}
			});
		});
  
		$('#updateEmail').on('click', function(e){
			e.preventDefault();
			var url = '/api/users/' + $(this).data('userId');
			var data = {
				email: $('#newEmail').val(),
			};

			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true); // eslint-disable-line no-undef        
				}
			});
		});

		$('#updatePassword').on('click', function(e){
			e.preventDefault();
			var url = '/api/users/' + $(this).data('userId');
			var data = {
				password: $('#newPassword').val()
			};

			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);  // eslint-disable-line no-undef                   
				}
			});
		});
    
		$('#updateRole').on('click', function(e){
			e.preventDefault();
			var url = '/api/users/' + $(this).data('userId');
			var data = {
				role: $('input[name=optionsModuleRoles]:checked','#editRole').val()
			};
			
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true); // eslint-disable-line no-undef                    
				}
			});
		});
		break;
		
	case 'ADMIN_USERS':

		$('#userDeleteModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#userToDeleteEmail').text(button.data('userEmail'));
			modal.find('#userDeleteConfirm').on('click', function(){
				var url = '/api/users/' + button.data('userId');
				$.ajax({
					type: 'DELETE',
					url: url,
					dataType: 'json',
					async: true,
					success: function (){
						location.reload(true); // eslint-disable-line no-undef 
					}
				});
			});
		});

		$('#userDeleteModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#userDeleteConfirm').off('click');
		});
	
		break;
	case 'ADMIN_GLOSSARY_TERM':

		$('#updateHeading').on('click', function(e){
			e.preventDefault();
			var url = '/admin/glossary/' + $(this).data('termId');
			var data = {
				heading: $('#newHeading').val()
			};

			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true); // eslint-disable-line no-undef              
				}
			});
		});
  
		$('#updateDefinition').on('click', function(e){
			e.preventDefault();
			var url = '/admin/glossary/' + $(this).data('termId');
			var data = {
				definition: $('#newDefinition').trumbowyg('html')
			};

			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                 
				}
			});
		});
  
		$('#updateMoreLink').on('click', function(e){
			e.preventDefault();
			var url = '/admin/glossary/' + $(this).data('termId');
			var data = {
				moreLink: $('#newMoreLink').val()
			};
  
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);   // eslint-disable-line no-undef                 
				}
			});
		});
  
		$('#updateAnchorLink').on('click', function(e){
			e.preventDefault();
			var url = '/admin/glossary/' + $(this).data('termId');
			var	data = {
				anchorLink: $('#newAnchorLink').val()
			};
  
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);   // eslint-disable-line no-undef                  
				}
			});
		});
  
		$('.trumbowyg').trumbowyg();
		break;

	case 'ADMIN_GLOSSARY':{
		// ReactDOM.render(
		// 	<AdminGlossary breadCrumbs = {[{title:'Admin', url: '/admin'}, {title:'Glossary', url: '/admin/glossary'}]}
		// 		activeNavItem = {'Glossary'} 
		// 	/>,
		// 	document.getElementById('root')// eslint-disable-line no-undef       
		// );

		$('#addGlossaryTerm').submit(function(e){
			e.preventDefault();
			var data = {
				heading: 	$('#termHeading').val(),
				definition: $('#termDefinition').trumbowyg('html'),
				moreLink: 	$('#moreLink').val()
			};

			$.ajax({
				type: 'POST',
				url: '/admin/glossary',
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);        // eslint-disable-line no-undef             
				}
			});
		});

		$('#termDeleteModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#termToDeleteHeading').text(button.data('termHeading'));
			modal.find('#termDeleteConfirm').on('click', function(){
				var url = '/admin/glossary/' + button.data('termId');
				$.ajax({
					type: 'DELETE',
					url: url,
					dataType: 'json',
					async: true,
					success: function (){
						location.reload(true);// eslint-disable-line no-undef 
					}
				});
			});
		});

		$('#termDeleteModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#termDeleteConfirm').off('click');
		});
    
		$('.trumbowyg').trumbowyg();
	

		break;
	}
	

	case 'ADMIN_TAGS':{
		
		$('#addTag').submit(function(e){
			e.preventDefault();
			var data = {
				name: 	$('#tagName').val(),
			};

			$.ajax({
				type: 'POST',
				url: '/api/tags',
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);        // eslint-disable-line no-undef             
				}
			});
		});

		$('#tagDeleteModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#tagToDeleteHeading').text(button.data('tagName'));
			modal.find('#tagDeleteConfirm').on('click', function(){
				var url = '/api/tags/' + button.data('tagId');
				$.ajax({
					type: 'DELETE',
					url: url,
					dataType: 'json',
					async: true,
					success: function (){
						location.reload(true);// eslint-disable-line no-undef 
					}
				});
			});
		});

		$('#tagDeleteModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#tagDeleteConfirm').off('click');
		});
    
		$('.trumbowyg').trumbowyg();
	

		break;
	}

	case 'ADMIN_QUESTIONS':
		$('#addResponse').submit(function(e){
     
			//var modal = $('#addResponseModal');
			e.preventDefault();
  
			var url = '/api/quizzes/' + $(this).data('quizId') + '/questions/' + $(this).data('questionId');
			var data = {};
  
			var newResponse = {};
			var r = $(this).data('responses') ;
			var responses = JSON.parse(JSON.stringify(r));
			newResponse.option = $('#responseText').val();
		
			if( $(this).find('input:checked').prop('checked')){
				newResponse.correct = true;
			} else {
				newResponse.correct = false;
			}
  
			responses.push(newResponse);
			data.a = JSON.stringify(responses);
			
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);        // eslint-disable-line no-undef             
				}
			});
		});
  

		$('#deleteResponseModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#responseDeleteConfirm').on('click', function(e){
				e.preventDefault();          
				var data = {};
				var responsesArray = button.data('responses');
				var responseToDeleteId = button.data('responseId');
				data.a = JSON.stringify(responsesArray.filter( response => response._id != responseToDeleteId));
				var url = '/api/quizzes/' + button.data('quizId') + '/questions/' + button.data('questionId');
  
				$.ajax({
					type: 'PUT',
					url: url,
					dataType: 'json',
					data: data,
					async: true,
					success: function (){
						location.reload(true);// eslint-disable-line no-undef 
					}
				});
			});
		});
  
		$('#deleteResponseModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#responseDeleteConfirm').off('click');
		});
  
		$('#updateCorrectResponse').on('click', function(e){
			e.preventDefault();
			var url = '/api/quizzes/' + $(this).data('quizId') + '/questions/' + $(this).data('questionId');
		
			var data = {
				correct: $('#newCorrectResponse').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                 
				}
			});
		});
		

		$('#updateQuestion').on('click', function(e){
			e.preventDefault();
			var url = '/api/quizzes/' + $(this).data('quizId') + '/questions/' + $(this).data('questionId');
		
			var data = {
				q: $('#newQuestion').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                 
				}
			});
		});


		$('#updateIncorrectResponse').on('click', function(e){
			e.preventDefault();
			var url = '/api/quizzes/' + $(this).data('quizId') + '/questions/' + $(this).data('questionId');		
			var data = {
				incorrect: $('#newIncorrectResponse').val()
			};

			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);  // eslint-disable-line no-undef                   
				}
			});
		});
  
		$('#updateOrder').on('click', function(e){
			e.preventDefault();
			var url = '/api/quizzes/' + $(this).data('quizId') + '/questions/' + $(this).data('questionId');
			var data = {
				order: $('#newOrder').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);     // eslint-disable-line no-undef                
				}
			});
		});

		break;

	case 'ADMIN_QUIZ':

		$('#updateName').on('click', function(e){
			e.preventDefault();
			var url = '/api/quizzes/' + $(this).data('quizId');
			var data = {
				name: $('#newTitle').val()
			};
			
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                 
				}
			});
		});

		$('#updateDescription').on('click', function(e){
			e.preventDefault();
			var url = '/api/quizzes/' + $(this).data('quizId');
			var data = {
				main: $('#newDescription').val()
			};

			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);       // eslint-disable-line no-undef              
				}
			});
		});

		$('#updateResultsCopy').on('click', function(e){
			e.preventDefault();
			var url = '/api/quizzes/' + $(this).data('quizId');
			var data = {
				results: $('#newResultsCopy').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);       // eslint-disable-line no-undef       
				}
			});
		});

		$('#quizAddAnswer').on('click', function(e){
			e.preventDefault();
			var answerInputField = '<div class="quizAnswer"><input type="text" class="form-control"><div class="checkbox"><label><input type="checkbox" > Check if Correct</label></div></div>';
			$('#quizAnswers').append(answerInputField);
		});

		$('#addQuestionModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('.quizAnswer').remove();
			//re-add an initial box
			var answerInputField = '<div class="quizAnswer"><input type="text" class="form-control"><div class="checkbox"><label><input type="checkbox" > Check if Correct</label></div></div>';
			$('#quizAnswers').append(answerInputField);
		});

		$('#addQuestion').submit(function(e){
			e.preventDefault();
			var form = $(this);
			var data = {
				q: $('#quizQuestion').val(),
				correct: $('#quizCorrectResponse').val(),
				incorrect: $('#quizIncorrectResponse').val()			
			};

			var responses = [];

			form.find('.quizAnswer').each(function(){
				var res = {};
				res.option = $(this).find(':input').val();
				if( $(this).find('input:checked').prop('checked')){
					res.correct = true;
				} else {
					res.correct = false;
				}
				responses.push(res);
			});
			data.a = responses;
			
			$.ajax({
				type: 'POST',
				url: '/api/quizzes/' + form.data('quizId') + '/questions',
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);           // eslint-disable-line no-undef   
				}
			});
		});

		$('#deleteQuestionModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#questionDeleteConfirm').on('click', function(){
				var url = '/api/quizzes/' + button.data('quizId') + '/questions/' + button.data('questionId');
				$.ajax({
					type: 'DELETE',
					url: url,
					dataType: 'json',
					async: true,
					success: function (){
						location.reload(true); // eslint-disable-line no-undef   
					}
				});
			});
		});

		$('#deleteQuizModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#quizDeleteConfirm').off('click');
		});
		break;

	case 'ADMIN_QUIZZES':

		$('#addQuiz').submit(function(e){
			e.preventDefault();
			var data = {};
			data.name = $('#quizName').val();
			$.ajax({
				type: 'POST',
				url: '/api/quizzes',
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);        // eslint-disable-line no-undef             
				}
			});
		});

		$('#deleteQuizModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#quizToDeleteName').text(button.data('quizName'));
			modal.find('#quizDeleteConfirm').on('click', function(){
				var url = '/api/quizzes/' + button.data('quizId');
				$.ajax({
					type: 'DELETE',
					url: url,
					dataType: 'json',
					async: true,
					success: function (){
						location.reload(true); // eslint-disable-line no-undef 
					}
				});
			});
		});

		$('#deleteQuizModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#quizDeleteConfirm').off('click');
		});
	
		break;
	case 'ADMIN_MODULE':

		$('#updateName').on('click', function(e){
			//var modal = $('#updateName');
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');
			var data = {
				name: $('#newTitle').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);// eslint-disable-line no-undef 
				}
			});
		});

		$('#updateType').on('click', function(e){
			//var modal = $('#updateName');
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');
			var data = {
				type: $('input[name=optionsModuleTypes]:checked','#editType').val()
			};
  
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);// eslint-disable-line no-undef 
				}
			});
		});

		$('#updateContentId').on('click', function(e){
			//var modal = $('#updateName');
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');
			var data = {
				contentId: $('#newContentId').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);// eslint-disable-line no-undef 
				}
			});
		});

		$('#updateDescription').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');      
			var data = {
				description: $('#newDescription').val()
			};

			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);     // eslint-disable-line no-undef                
				}
			});
		});

		$('#updateOrder').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');      
			var data = {
				order: $('#newOrder').val()
			};
			
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                 
				}
			});
		});
  
		$('#deleteResourceModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#resourceDeleteConfirm').on('click', function(e){
				e.preventDefault();          
				var data = {};
				var resourcesArray = button.data('resources');
				var resourceToDeleteId = button.data('resourceId');
				data.resources = JSON.stringify(resourcesArray.filter( resource => resource._id != resourceToDeleteId));
				var url = '/api/courses/' + button.data('courseId') + '/units/' + button.data('unitId') + '/modules/' + button.data('moduleId');
				$.ajax({
					type: 'PUT',
					url: url,
					dataType: 'json',
					data: data,
					async: true,
					success: function (){
						location.reload(true);// eslint-disable-line no-undef 
					}
				});
			});
		});
  
		$('#deleteResourceModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#resourceDeleteConfirm').off('click');
		});
  
		$('#addResource').submit(function(e){
			//var modal = $('#moduleAddModal');
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + '/units/' + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');
			var data = {};

			
			var newResource = {
				title: $('#resourceName').val(),
				url: $('#resourceUrl').val()
			};
			var r = $(this).data('resources') ;
			// this is ugly
			var resources = JSON.parse(JSON.stringify(r));
			resources.push(newResource);
			data.resources = JSON.stringify(resources);
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true); // eslint-disable-line no-undef                    
				}
			});
		});
		break;

	case 'ADMIN_UNIT':{

		// let courseId = $('body').data('courseId');
		// let courseTitle = $('body').data('courseTitle');
		// let unitId = $('body').data('unitId');
		// let unitTitle = $('body').data('unitTitle');

		// ReactDOM.render(
		// 	<AdminUnit breadCrumbs = {[{title:'Admin', url: '/admin'}, {title:'Courses', url: '/admin/courses'}, {title:courseTitle, url: '/admin/courses/' + courseId }, {title:unitTitle, url: '/admin/courses/' + courseId +'/units/' + unitId},
		// 	]} activeNavItem = {'Courses'} courseTitle = {courseTitle} courseId={courseId} unitTitle = {unitTitle} unitId = {unitId} />,
		// 	document.getElementById('root')// eslint-disable-line no-undef       
		// ); 

		$('#moduleDeleteModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#moduleToDeleteName').text(button.data('moduleName'));
			modal.find('#moduleDeleteConfirm').on('click', function(){
				var url = '/api/courses/' + button.data('courseId') + '/units/' + button.data('unitId') + '/modules/' + button.data('moduleId');
				$.ajax({
					type: 'DELETE',
					url: url,
					dataType: 'json',
					async: true,
					success: function (){
						location.reload(true);// eslint-disable-line no-undef 
					}
				});
			});
		});

		$('#moduleDeleteModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#moduleDeleteConfirm').off('click');
		});

		$('#updateName').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + '/units/' + $(this).data('unitId');
			var data = {
				name: $('#newTitle').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);   // eslint-disable-line no-undef                  
				}
			});
		});

		$('#updateDescription').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + '/units/' + $(this).data('unitId');
			var data = {
				description: $('#newDescription').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                
				}
			});
		});

		$('#updateShortDescription').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + '/units/' + $(this).data('unitId');
			var data = {
				shortDescription: $('#newShortDescription').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                
				}
			});
		});

		$('#updateUnitImages').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + '/units/' + $(this).data('unitId');
			var data = {
				unitImageUrl: $('#newMainImageURL').val(),
				unitThumbImageUrl: $('#newThumbImageURL').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);    // eslint-disable-line no-undef                 
				}
			});
		});


		$('#updateOrder').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + '/units/' + $(this).data('unitId');
			var data = {
				order: $('#newOrder').val()
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);  // eslint-disable-line no-undef                   
				}
			});
		});
    
		$('#updateStatus').on('click', function(e){
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + '/units/' + $(this).data('unitId');
			var data = {
				published: !$(this).data('publish')
			};
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);   // eslint-disable-line no-undef                  
				}
			});
		});

		$('#addModule').submit(function(e){
			//var modal = $('#moduleAddModal');
			e.preventDefault();
			var url = '/api/courses/' + $(this).data('courseId') + '/units/' + $(this).data('unitId') + '/modules' ;
			var data = {};
			data.name = $('#moduleName').val();
			data.description = $('#moduleDescription').val();
			data.order = $('#moduleOrder').val() || 99;
			data.type= $('input[name=optionsModuleTypes]:checked','#addModule').val();
			$.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true); // eslint-disable-line no-undef                    
				}
			});
		});

		$('#addTag').submit(function(e){
			//var modal = $('#moduleAddModal');
			e.preventDefault();

			let tagId =  $('#tagSelect option:selected').val();
			var url = '/api/tags/' + tagId;
			var data = {};
			data.course =  $(this).data('courseId');
			data.unit = $(this).data('unitId');
			
			$.ajax({
				type: 'PUT',
				url: url,
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true); // eslint-disable-line no-undef                    
				}
			});
		});

		$('#tagRemoveModal').on('show.bs.modal', function(e){
			var button = $(e.relatedTarget); 
			var modal = $(this);
			modal.find('#tagRemoveConfirm').on('click', function(){
				var url = '/api/tags/' + button.data('tagId');
				var data = {};
				data.unit = button.data('unitId');
				data.remove = true;
				$.ajax({
					type: 'PUT',
					url: url,
					dataType: 'json',
					data: data,
					async: true,
					success: function (){
						location.reload(true);// eslint-disable-line no-undef 
					}
				});
			});
		});

		$('#tagRemoveModal').on('hide.bs.modal', function(){
			var modal = $(this);
			modal.find('#tagRemoveConfirm').off('click');
		});


		break;
	}
	case 'ACADEMY_OPTIONS':
		$('#setOptions').submit(function(e){
			e.preventDefault();
			var data = {
				academyIntroText: $('#academyIntroText').trumbowyg('html'),
				academyNewsText:  $('#academyNewsText').trumbowyg('html'),
				academyNewsHeadline: $('#academyNewsHeadline').val(),
				academyHomeCta: $('#academyHomeCta').val()
			};
			
			console.log(data);
			$.ajax({
				type: 'PUT',
				url: '/admin/academy',
				dataType: 'json',
				async: true,
				data: data,
				success: function (){
					location.reload(true);   // eslint-disable-line no-undef                  
				}
			});
		});
	
		$('.trumbowyg').trumbowyg();

		break;
	default:
		//console.log('hi');
	}
});
