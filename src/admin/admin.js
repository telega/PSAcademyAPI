import 'bootstrap';
const $ = require( 'jquery' ); // make eslint happy
import 'trumbowyg';

$(document).ready(function(){ // eslint-disable-line no-undef 

	$.trumbowyg.svgPath = '/public/icons.svg';


	// pageUIType is appended to body by page template
	// here it is used to determine which ui functions to load on the page
	// they are all here to facilitate moving to a frontend framework 

	let pageType = $('body').data('pageUiType');
	switch(pageType){
		
	case 'ADMIN_COURSES':

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

	case 'ADMIN_COURSE':
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

    $("#updateName").on('click', function(e){
      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId');
      data = {
        name: $('#newTitle').val()
      }
      $.ajax({
                type: "PUT",
                url: url,
                dataType: 'json',
                async: true,
                data: data,
                success: function (){
                  location.reload(true);                    
                }
      });
    })

    $("#updateDescription").on('click', function(e){
      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId');
      data = {
        description: $('#newDescription').val()
      }
      $.ajax({
                type: "PUT",
                url: url,
                dataType: 'json',
                async: true,
                data: data,
                success: function (){
                        location.reload(true);                    
                    }
      });
    })

    $("#updateCourseImages").on('click', function(e){
      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId');
      data = {
        courseImageUrl: $('#newMainImageURL').val(),
        courseThumbImageUrl: $('#newThumbImageURL').val()
      }
      $.ajax({
                type: "PUT",
                url: url,
                dataType: 'json',
                async: true,
                data: data,
                success: function (){
                        location.reload(true);                    
                    }
      });
    })

    $("#updateOrder").on('click', function(e){
      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId');
      data = {
        order: $('#newOrder').val()
      }
      $.ajax({
                type: "PUT",
                url: url,
                dataType: 'json',
                async: true,
                data: data,
                success: function (){
                        location.reload(true);                    
                    }
      });
    })
    
      $("#updateStatus").on('click', function(e){
        e.preventDefault();
        var url = "/api/courses/" + $(this).data('courseId');
        data = {
          published: !$(this).data('publish')
        }
      $.ajax({
                type: "PUT",
                url: url,
                dataType: 'json',
                async: true,
                data: data,
                success: function (){
                        location.reload(true);                    
                    }
      });
    })

    $('#addUnit').submit(function(e){
      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId') + "/units";
      var data = {};
      data.name = $("#unitName").val();
      data.description = $("#unitDescription").val();
      data.order = $("#unitOrder").val() || 99;
      $.ajax({
          type: "POST",
          url: url,
          dataType: 'json',
          async: true,
          data: data,
          success: function (){
                location.reload(true);                    
              }
          });
    });
		break;
	case 'ADMIN_FEEDBACK':

	$('#feedbackDeleteModal').on('show.bs.modal', function(e){
        var button = $(e.relatedTarget); 
        var modal = $(this);
        modal.find('#feedbackToDeleteName').text(button.data('feedbackName'));
        modal.find('#feedbackDeleteConfirm').on('click', function(e){
            var url = "/api/feedback/" + button.data('feedbackId');
            $.ajax({
                  type: "DELETE",
                  url: url,
                  dataType: 'json',
                  async: true,
                  success: function (){
                        location.reload(true);
                    }
            })
        })
    });

    $('#feedbackDeleteModal').on('hide.bs.modal', function(e){
        var modal = $(this);
        modal.find('#feedbackDeleteConfirm').off('click');
    });

    $('#updateStatusModal').on('show.bs.modal', function(e){
        var button = $(e.relatedTarget);
        var modal = $(this)
        modal.find('#toggleStatus').on('click', function(e){
            var url = "/api/feedback/" + button.data('feedbackId');
            data = {
                published: !$(button).data('publish')
            }
            $.ajax({
                type: "PUT",
                url: url,
                dataType: 'json',
                async: true,
                data: data,
                success: function (){
                    location.reload(true);                    
                }
            });
        })
    })

		break;
	case 'ADMIN_HOME':
		// TODO
		break;
	case 'ADMIN_USER':

    $("#updateName").on('click', function(e){
		e.preventDefault();
		var url = "/api/users/" + $(this).data('userId');
		data = {
		  firstName: $('#newFirstName').val(),
		  lastName: $('#newLastName').val()
		}
		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
					location.reload(true);                    
				  }
		});
	  })
  
	  $("#updateEmail").on('click', function(e){
		e.preventDefault();
		var url = "/api/users/" + $(this).data('userId');
		data = {
		  email: $('#newEmail').val(),
		}
		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
					location.reload(true);                    
				  }
		});
	  })
  
  
		$("#updatePassword").on('click', function(e){
		e.preventDefault();
		var url = "/api/users/" + $(this).data('userId');
		data = {
		  password: $('#newPassword').val()
		}
		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
					location.reload(true);                    
				  }
		});
	  })
  
  
		$("#updateRole").on('click', function(e){
		e.preventDefault();
		var url = "/api/users/" + $(this).data('userId');
		data = {
		  role: $("input[name=optionsModuleRoles]:checked","#editRole").val()
		}
		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
					location.reload(true);                    
				  }
		});
	  })
		break;
	case 'ADMIN_USERS':
		  
	$('#userDeleteModal').on('show.bs.modal', function(e){
        var button = $(e.relatedTarget); 
        var modal = $(this);
        modal.find('#userToDeleteEmail').text(button.data('userEmail'));
        modal.find('#userDeleteConfirm').on('click', function(e){
            var url = "/api/users/" + button.data('userId');
            $.ajax({
                  type: "DELETE",
                  url: url,
                  dataType: 'json',
                  async: true,
                  success: function (){
                        location.reload(true);
                    }
            })
        })
    });

    $('#userDeleteModal').on('hide.bs.modal', function(e){
        var modal = $(this);
        modal.find('#userDeleteConfirm').off('click');
	});
	
		break;
	case 'ADMIN_GLOSSARY_TERM':

	$("#updateHeading").on('click', function(e){
		e.preventDefault();
		var url = "/admin/glossary/" + $(this).data('termId');
		data = {
		  heading: $('#newHeading').val()
		}
		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
					location.reload(true);                    
				  }
		});
	  })
  
	  $("#updateDefinition").on('click', function(e){
		e.preventDefault();
		var url = "/admin/glossary/" + $(this).data('termId');
		var data = {
		  definition: $('#newDefinition').trumbowyg('html')
		}

		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
						  location.reload(true);                    
					  }
		});
	  })
  
	  $("#updateMoreLink").on('click', function(e){
		e.preventDefault();
		var url = "/admin/glossary/" + $(this).data('termId');
		data = {
		  moreLink: $('#newMoreLink').val()
		}
  
		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
						  location.reload(true);                    
					  }
		});
	  })
  
	  $("#updateAnchorLink").on('click', function(e){
		e.preventDefault();
		var url = "/admin/glossary/" + $(this).data('termId');
		data = {
		  anchorLink: $('#newAnchorLink').val()
		}
  
		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
						  location.reload(true);                    
					  }
		});
	  })
  
	  $('.trumbowyg').trumbowyg();


		break;
	case 'ADMIN_GLOSSARY':
	$("#addGlossaryTerm").submit(function(e){
        e.preventDefault();
        var data = {
			heading: 	$("#termHeading").val(),
			definition: $("#termDefinition").trumbowyg('html'),
			moreLink: 	$("#moreLink").val()
		}

		$.ajax({
           type: "POST",
           url: "/admin/glossary",
           dataType: 'json',
           async: true,
           data: data,
           success: function (){
                   location.reload(true);                    
               }
           });
    })

    $('#termDeleteModal').on('show.bs.modal', function(e){
        var button = $(e.relatedTarget); 
        var modal = $(this);
        modal.find('#termToDeleteHEading').text(button.data('termHeading'));
        modal.find('#termDeleteConfirm').on('click', function(e){
            var url = "/admin/glossary/" + button.data('termId');
            $.ajax({
                  type: "DELETE",
                  url: url,
                  dataType: 'json',
                  async: true,
                  success: function (){
                        location.reload(true);
                    }
            })
        })
    });

    $('#termDeleteModal').on('hide.bs.modal', function(e){
        var modal = $(this);
        modal.find('#termDeleteConfirm').off('click');
    });
    
    $('.trumbowyg').trumbowyg();
	
		break;
	case 'ADMIN_QUESTIONS':
	$("#addResponse").submit(function(e){
     
		var modal = $("#addResponseModal");
		e.preventDefault();
  
		var url = "/api/quizzes/" + $(this).data('quizId') + "/questions/" + $(this).data('questionId');
		var data = {};
  
		var newResponse = {}
		var r = $(this).data('responses') ;
		var responses = JSON.parse(JSON.stringify(r));
		newResponse.option = $("#responseText").val();
		
		if( $(this).find('input:checked').prop('checked')){
			  newResponse.correct = true;
			} else {
			  newResponse.correct = false;
		}
  
		responses.push(newResponse);
		data.a = JSON.stringify(responses);
		
		console.log(data);
  
		$.ajax({
		  type: "PUT",
		  url: url,
		  dataType: 'json',
		  async: true,
		  data: data,
		  success: function (){
				location.reload(true);                    
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
			var responseToDeleteId = button.data('responseId')
			data.a = JSON.stringify(responsesArray.filter( response => response._id != responseToDeleteId));
			var url = "/api/quizzes/" + button.data('quizId') + '/questions/' + button.data('questionId');
  
			$.ajax({
					type: "PUT",
					url: url,
					dataType: 'json',
					data: data,
					async: true,
					success: function (){
					   location.reload(true);
					}
			})
		  })
	  });
  
	  $('#deleteResponseModal').on('hide.bs.modal', function(e){
		  var modal = $(this);
		  modal.find('#responseDeleteConfirm').off('click');
	  });
  
	  $("#updateCorrectResponse").on('click', function(e){
		e.preventDefault();
		var url = "/api/quizzes/" + $(this).data('quizId') + /questions/ + $(this).data('questionId');
		
		data = {
		  correct: $('#newCorrectResponse').val()
		}
		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
					location.reload(true);                    
				  }
		});
	  })
	  
	  $("#updateIncorrectResponse").on('click', function(e){
		e.preventDefault();
		var url = "/api/quizzes/" + $(this).data('quizId') + /questions/ + $(this).data('questionId');
		
		data = {
		  incorrect: $('#newIncorrectResponse').val()
		}
		console.log(data);
		$.ajax({
				  type: "PUT",
				  url: url,
				  dataType: 'json',
				  async: true,
				  data: data,
				  success: function (){
					location.reload(true);                    
				  }
		});
	  })
  
	  $("#updateOrder").on('click', function(e){
		e.preventDefault();
		var url = "/api/quizzes/" + $(this).data('quizId') + /questions/ + $(this).data('questionId');
		data = {
		  order: $('#newOrder').val()
		}
		$.ajax({
			  type: "PUT",
			  url: url,
			  dataType: 'json',
			  async: true,
			  data: data,
			  success: function (){
					  location.reload(true);                    
				  }
		});
	  });

		break;
	case 'ADMIN_QUIZ':

   $("#updateName").on('click', function(e){
	e.preventDefault();
	var url = "/api/quizzes/" + $(this).data('quizId');
	data = {
	  name: $('#newTitle').val()
	}
	$.ajax({
			  type: "PUT",
			  url: url,
			  dataType: 'json',
			  async: true,
			  data: data,
			  success: function (){
				location.reload(true);                    
			  }
	});
  })

  $("#updateDescription").on('click', function(e){
	e.preventDefault();
	var url = "/api/quizzes/" + $(this).data('quizId');
	data = {
	  main: $('#newDescription').val()
	}
	$.ajax({
			  type: "PUT",
			  url: url,
			  dataType: 'json',
			  async: true,
			  data: data,
			  success: function (){
					  location.reload(true);                    
				  }
	});
  })

$("#updateResultsCopy").on('click', function(e){
	e.preventDefault();
	var url = "/api/quizzes/" + $(this).data('quizId');
	data = {
	  results: $('#newResultsCopy').val()
	}
	$.ajax({
			  type: "PUT",
			  url: url,
			  dataType: 'json',
			  async: true,
			  data: data,
			  success: function (){
					  location.reload(true);                    
				  }
	});
  })



$('#quizAddAnswer').on('click', function(e){
  e.preventDefault();
  var answerInputField = '<div class="quizAnswer"><input type="text" class="form-control"><div class="checkbox"><label><input type="checkbox" > Check if Correct</label></div></div>';
  $('#quizAnswers').append(answerInputField);
})

$('#addQuestionModal').on('hide.bs.modal', function(e){
  var modal = $(this);
  modal.find(".quizAnswer").remove();
  //re-add an initial box
  var answerInputField = '<div class="quizAnswer"><input type="text" class="form-control"><div class="checkbox"><label><input type="checkbox" > Check if Correct</label></div></div>';
  $('#quizAnswers').append(answerInputField);
});

$("#addQuestion").submit(function(e){
	  e.preventDefault();
	  var form = $(this);
	  var data = {}
	  
	  data.q = $("#quizQuestion").val();
	  data.correct = $('#quizCorrectResponse').val();
	  data.incorrect = $('#quizIncorrectResponse').val();

	  var responses = [];
	  

	  form.find('.quizAnswer').each(function(){
		var res = {}
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
		type: "POST",
		url: "/api/quizzes/" + form.data('quizId') + "/questions",
		dataType: 'json',
		async: true,
		data: data,
		success: function (){
			location.reload(true);                    
		  }
	  });
});

$('#deleteQuestionModal').on('show.bs.modal', function(e){
	  var button = $(e.relatedTarget); 
	  var modal = $(this);
	  modal.find('#questionDeleteConfirm').on('click', function(e){
		  var url = "//api/quizzes/" + button.data('quizId') + "/questions/" + button.data('questionId');
		  $.ajax({
				type: "DELETE",
				url: url,
				dataType: 'json',
				async: true,
				success: function (){
					location.reload(true);
				}
		  })
	  })
});

$('#deleteQuizModal').on('hide.bs.modal', function(e){
	  var modal = $(this);
	  modal.find('#quizDeleteConfirm').off('click');
});
		break;
	case 'ADMIN_QUIZZES':

	$("#addQuiz").submit(function(e){
        e.preventDefault();
        var data = {}
        data.name = $("#quizName").val();
        $.ajax({
            type: "POST",
            url: "/api/quizzes",
            dataType: 'json',
            async: true,
            data: data,
            success: function (){
                location.reload(true);                    
              }
            });
    })

    $('#deleteQuizModal').on('show.bs.modal', function(e){
        var button = $(e.relatedTarget); 
        var modal = $(this);
        modal.find('#quizToDeleteName').text(button.data('quizName'));
        modal.find('#quizDeleteConfirm').on('click', function(e){
            var url = "/api/quizzes/" + button.data('quizId');
            $.ajax({
                  type: "DELETE",
                  url: url,
                  dataType: 'json',
                  async: true,
                  success: function (){
                        location.reload(true);
                    }
            })
        })
    });

    $('#deleteQuizModal').on('hide.bs.modal', function(e){
        var modal = $(this);
        modal.find('#quizDeleteConfirm').off('click');
	});
	
		break;
	case 'ADMIN_MODULE':


    $("#updateName").on('click', function(e){
		var modal = $("#updateName");
		e.preventDefault();
		var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');
		data = {
		  name: $('#newTitle').val()
		}
		$.ajax({
			type: "PUT",
			url: url,
			dataType: 'json',
			async: true,
			data: data,
			success: function (){
				location.reload(true);
			}
		});
	  })
  
	  $("#updateType").on('click', function(e){
		var modal = $("#updateName");
		e.preventDefault();
		var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');
		data = {
		  type: $("input[name=optionsModuleTypes]:checked","#editType").val()
		}
  
		$.ajax({
			type: "PUT",
			url: url,
			dataType: 'json',
			async: true,
			data: data,
			success: function (){
				location.reload(true);
			}
		});
	  })
  
	  $("#updateContentId").on('click', function(e){
		var modal = $("#updateName");
		e.preventDefault();
		var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');
		data = {
		  contentId: $('#newContentId').val()
		}
		$.ajax({
			type: "PUT",
			url: url,
			dataType: 'json',
			async: true,
			data: data,
			success: function (){
				location.reload(true);
			}
		});
	  })
  
	  $("#updateDescription").on('click', function(e){
		e.preventDefault();
		var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');      
		data = {
		  description: $('#newDescription').val()
		}
		$.ajax({
			type: "PUT",
			url: url,
			dataType: 'json',
			async: true,
			data: data,
			success: function (){
				location.reload(true);                    
			}
		});
	  })
  
	  $("#updateOrder").on('click', function(e){
		e.preventDefault();
		var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId') + '/modules/' + $(this).data('moduleId');      
		data = {
		  order: $('#newOrder').val()
		}
		$.ajax({
			type: "PUT",
			url: url,
			dataType: 'json',
			async: true,
			data: data,
			success: function (){
				location.reload(true);                    
			}
		});
	  })
  
	  $('#deleteResourceModal').on('show.bs.modal', function(e){
		  var button = $(e.relatedTarget); 
		  var modal = $(this);
		  modal.find('#resourceDeleteConfirm').on('click', function(e){
			e.preventDefault();          
			var data = {};
			var resourcesArray = button.data('resources');
			var resourceToDeleteId = button.data('resourceId')
			data.resources = JSON.stringify(resourcesArray.filter( resource => resource._id != resourceToDeleteId));
			var url = "/api/courses/" + button.data('courseId') + '/units/' + button.data('unitId') + '/modules/' + button.data('moduleId');
			   $.ajax({
					type: "PUT",
					url: url,
					dataType: 'json',
					data: data,
					async: true,
					success: function (){
					   location.reload(true);
					}
			  })
		  })
	  });
  
	  $('#deleteResourceModal').on('hide.bs.modal', function(e){
		  var modal = $(this);
		  modal.find('#resourceDeleteConfirm').off('click');
	  });
  
	  $('#addResource').submit(function(e){
		var modal = $("#moduleAddModal");
  
		e.preventDefault();
		var url = "/api/courses/" + $(this).data('courseId') + "/units/" + $(this).data('unitId') + "/modules/" + $(this).data('moduleId');
		var data = {};
		var newResource = {}
		var r = $(this).data('resources') ;
		var resources = JSON.parse(JSON.stringify(r));
		newResource.title = $("#resourceName").val();
		newResource.url = $("#resourceUrl").val();
		var newResource = {
			title: newResource.title,
			url: newResource.url
		};
		resources.push(newResource);
		data.resources = JSON.stringify(resources);
		$.ajax({
		  type: "PUT",
		  url: url,
		  dataType: 'json',
		  async: true,
		  data: data,
		  success: function (){
				location.reload(true);                    
			  }
		  });
	  });
		break;
	case 'ADMIN_UNIT':
	  
	$('#moduleDeleteModal').on('show.bs.modal', function(e){
        var button = $(e.relatedTarget); 
        var modal = $(this);
        modal.find('#moduleToDeleteName').text(button.data('moduleName'));
        modal.find('#moduleDeleteConfirm').on('click', function(e){
        var url = "/api/courses/" + button.data('courseId') + '/units/' + button.data('unitId') + '/modules/' + button.data('moduleId');
        console.log(url);
            $.ajax({
                  type: "DELETE",
                  url: url,
                  dataType: 'json',
                  async: true,
                  success: function (){
                        location.reload(true);
                    }
            })
        })
    });

    $('#moduleDeleteModal').on('hide.bs.modal', function(e){
        var modal = $(this);
        modal.find('#moduleDeleteConfirm').off('click');
    });

    $("#updateName").on('click', function(e){
      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId');
      data = {
        name: $('#newTitle').val()
      }
      $.ajax({
                type: "PUT",
                url: url,
                dataType: 'json',
                async: true,
                data: data,
                success: function (){
                  location.reload(true);                    
                }
      });
    })

    $("#updateDescription").on('click', function(e){
      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId');
      data = {
        description: $('#newDescription').val()
      }
      $.ajax({
                type: "PUT",
                url: url,
                dataType: 'json',
                async: true,
                data: data,
                success: function (){
                        location.reload(true);                    
                    }
      });
    })

    $("#updateUnitImages").on('click', function(e){
      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId');
      data = {
        unitImageUrl: $('#newMainImageURL').val(),
        unitThumbImageUrl: $('#newThumbImageURL').val()
      }
      $.ajax({
                type: "PUT",
                url: url,
                dataType: 'json',
                async: true,
                data: data,
                success: function (){
                        location.reload(true);                    
                    }
      });
    })


    $("#updateOrder").on('click', function(e){
      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId');
      data = {
        order: $('#newOrder').val()
      }
      $.ajax({
            type: "PUT",
            url: url,
            dataType: 'json',
            async: true,
            data: data,
            success: function (){
                    location.reload(true);                    
                }
      });
    })
    
    $("#updateStatus").on('click', function(e){
        e.preventDefault();
        var url = "/api/courses/" + $(this).data('courseId') + /units/ + $(this).data('unitId');
        data = {
          published: !$(this).data('publish')
        }
      $.ajax({
            type: "PUT",
            url: url,
            dataType: 'json',
            async: true,
            data: data,
            success: function (){
                    location.reload(true);                    
                }
      });
    })

    $('#addModule').submit(function(e){
      var modal = $("#moduleAddModal");

      e.preventDefault();
      var url = "/api/courses/" + $(this).data('courseId') + "/units/" + $(this).data('unitId') + "/modules" ;
      var data = {};
      data.name = $("#moduleName").val();
      data.description = $("#moduleDescription").val();
      data.order = $("#moduleOrder").val() || 99;
      data.type= $("input[name=optionsModuleTypes]:checked","#addModule").val();
      $.ajax({
          type: "POST",
          url: url,
          dataType: 'json',
          async: true,
          data: data,
          success: function (){
                location.reload(true);                    
              }
          });
    });

		break;
	case 'ACADEMY_OPTIONS':
		$('#setOptions').submit(function(e){
			e.preventDefault();
			var data = {
				academyIntroText: $('#academyIntroText').trumbowyg('html'),
				academyNewsText:  $('#academyNewsText').trumbowyg('html'),
				academyNewsHeadline: $('#academyNewsHeadline').val(),
				academyHomeCta: $('#academyHomeCta').val()
			};
			
			console.log(data)
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
		console.log('hi');
	}
});
