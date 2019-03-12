
	$(function() {
		var headers = {};
		headers[$("meta[name='_csrf_header']").attr("content")] = $("meta[name='_csrf']").attr("content");
		
		var num = 0, resId = "gx_ttj_001_daodu_7";
		
		function updateValid() {
			//有效播放时间
			var validData = resourceTimes[resId];
			var validTotalTime = validData['totalTime']; //视频总时间。
			var validFlag = true;   //是否为100% ,为true, ne 100%
			var validBeginTime = "0";			//开始时间或开始进度  flag为true时为进度
			var valid = validData['valid'];
			var validTime = valid + validBeginTime * validTotalTime / 100;
			if (validFlag) {
				//$('#valid_text').removeClass('hide');
				if (isNaN(validTime)) {
					$('#second').html('00');
					$('#minute').html('00');
					$('#hour').html('00');
				} else {
					if (validTime >= validTotalTime) {
						$('#hour').html(parseInt(validTotalTime / 3600));
						if (parseInt(validTotalTime % 3600 / 60) < 10) {
							$('#minute').html('0' + parseInt(validTotalTime % 3600 / 60));
						} else {
							$('#minute').html(parseInt(validTotalTime % 3600 / 60));
						}
						
						if (parseInt(validTotalTime % 3600 % 60) < 10) {
							$('#second').html('0' + parseInt(validTotalTime % 3600 % 60));
						} else {
							$('#second').html(parseInt(validTotalTime % 3600 % 60));
						}
					} else {
						$('#hour').html(parseInt(validTime / 3600));
						if (parseInt(validTime % 3600 / 60) < 10) {
							$('#minute').html('0' + parseInt(validTime % 3600 / 60));
						} else {
							$('#minute').html(parseInt(validTime % 3600 / 60));
						}
						
						if (parseInt(validTime % 3600 % 60) < 10) {
							$('#second').html('0' + parseInt(validTime % 3600 % 60));
						} else {
							$('#second').html(parseInt(validTime % 3600 % 60));
						}
					}
				}
			} else {
				$('#hour').html(parseInt(validTotalTime / 3600));
				if (parseInt(validTotalTime % 3600 / 60) < 10) {
					$('#minute').html('0' + parseInt(validTotalTime % 3600 / 60));
				} else {
					$('#minute').html(parseInt(validTotalTime % 3600 / 60));
				}
				
				if (parseInt(validTotalTime % 3600 % 60) < 10) {
					$('#second').html('0' + parseInt(validTotalTime % 3600 % 60));
				} else {
					$('#second').html(parseInt(validTotalTime % 3600 % 60));
				}
			}
		}
		setInterval(updateValid, 1000);
		
		// 记录当前章节学习进度
		function saveProgress(callback) {
			var data = resourceTimes[resId];
			var totalTime = data['totalTime'];  //视频总时间。
			var flag = true;   //是否为100% ,为true, ne 100%
			var beginTime = "0";			//开始时间或开始进度  flag为true时为进度
			var valid = data['valid'];
			//视频当前播放的时间点。
			var currentTime = data['pointTime'];
			
			//视频观看的进度,有20s的误差
			var progress;
			
			if (flag) {
				//修改100%判断，播放时间与总时间差值为50s，并且进度大于50%
				if (beginTime != 0) {
					if ((valid + totalTime*beginTime/100) >= totalTime * 0.5 && totalTime - currentTime <= 50) {
						progress = 100;
						valid = totalTime;
						currentTime = 0;
					} else {
						progress = ((valid + totalTime*beginTime/100) / totalTime) * 100;
						/* if (progress >= 80) {
							progress = 80;
						} */
						if (progress >= 90) {
							progress = 100;
							valid = totalTime;
							currentTime = 0;
						}
						valid = valid + totalTime*beginTime/100;
						if (valid > totalTime) {
							valid = totalTime;
						}
					}
				} else {
					if (valid >= totalTime * 0.5 && totalTime - currentTime <= 50) {
						progress = 100;
						valid = totalTime;
						currentTime = 0;
					} else {
						progress = (valid/totalTime)*100;
						/* if (progress >= 80) {
							progress = 80;
						} */
						if (progress >= 90) {
							progress = 100;
							valid = totalTime;
							currentTime = 0;
						}
						if (valid > totalTime) {
							valid = totalTime;
						}
					}
					
				}
				/* if ((totalTime - currentTime) <= 20) {
					progress = 100;
					currentTime = 0;
				} else {
					progress = (currentTime/totalTime)*100;
				} */	
			} else {
				valid = totalTime;
				progress = 100;
			}
			
			if (progress == 100) {
				num++;
			}
			
			if(totalTime > 0 && (currentTime >= 0 || currentTime == '') && num <= 1){
				$.ajax({
					type: 'post',
					url: "\/courses\/gx_ttj_001_002\/outlines\/gx_ttj_001_07\/items\/gx_ttj_001_daodu_7\/learning",
					headers: headers,
					data: { progress: progress, current: currentTime, total:totalTime, valid:parseInt(valid) },
					success: function() {
						if (callback)
							callback();
					},
					error: function() {
						if (callback)
							callback();
					}
				});
			} else {
				if (callback)
					callback();
			}
		}
		
		setInterval(saveProgress, (new Date().getHours < 9 && new Date().getHours > 18) ? 30000 : 50000); //9点-18点之间 50s，其他30s
		
		//点击章节切换实现同步
		$('.switch').on('click', function() {
			var $this = $(this);
			saveProgress(function() {
				//console.log($this.attr('href'));
				window.location.href = $this.attr('href');
			});
			return false;
		})
		
		// 离开当前页面事件
		window.onbeforeunload = function() {
			saveProgress();
		}
		
	});
	function vaildDate() {
		$('#second').html(parseInt($('#second').html()) + 1);
		if (parseInt($('#second').html()) == 60) {
			$('#second').html('00');
			$('#minute').html(parseInt($('#minute').html()) + 1);
			if (parseInt($('#minute').html()) == 60) {
				$('#minute').html('00');
				$('#hour').html(parseInt($('#hour').html()) + 1);
			}
		}
	}
	
	
