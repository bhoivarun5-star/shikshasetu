import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Profile, CourseVideo, VideoProgress, CourseBadge

# Create your views here.

import random

def generate_unique_username(email, first_name=""):
    base = ""
    if email:
        base = email.split('@')[0]
    elif first_name:
        base = "".join(c for c in first_name if c.isalnum()).lower()
    else:
        base = "user"
        
    base = base[:20]
    
    username = base
    # Check uniqueness
    while Profile.objects.filter(username__iexact=username).exists() or User.objects.filter(username__iexact=username).exists():
        username = f"{base}_{random.randint(100, 999)}"
        
    return username


@csrf_exempt
def register_view(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Only POST method allowed.'}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('fullName', '')
        mobile_number = data.get('mobileNumber', '')
        
        if not email or not password:
            return JsonResponse({'success': False, 'message': 'Email and Password are required.'}, status=400)
            
        if User.objects.filter(username=email).exists():
            return JsonResponse({'success': False, 'message': 'User with this email already exists.'}, status=400)
            
        # Create User
        user = User.objects.create_user(username=email, email=email, password=password)
        user.first_name = full_name
        user.save()
        
        # Create Profile
        username = generate_unique_username(email, full_name)
        Profile.objects.create(user=user, mobile_number=mobile_number, username=username)
        
        return JsonResponse({'success': True, 'message': 'User registered successfully.'}, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON format.'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
def login_view(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Only POST method allowed.'}, status=405)
        
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse({'success': False, 'message': 'Email and Password are required.'}, status=400)
            
        user = authenticate(username=email, password=password)
        
        if user is not None:
            login(request, user)
            
            # Fetch profile details if exist
            mobile_number = ''
            bio = ''
            skills = ''
            profile_image = ''
            try:
                if hasattr(user, 'profile'):
                    mobile_number = user.profile.mobile_number
                    bio = user.profile.bio
                    skills = user.profile.skills
                    profile_image = getattr(user.profile, 'profile_image', '') or ''
            except Exception:
                pass

            return JsonResponse({
                'success': True,
                'message': 'Logged in successfully.',
                'user': {
                    'email': user.email,
                    'fullName': user.first_name,
                    'mobileNumber': mobile_number,
                    'bio': bio,
                    'skills': skills,
                    'profile_image': profile_image
                }
            }, status=200)
        else:
            return JsonResponse({'success': False, 'message': 'Invalid email or password.'}, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON format.'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
def user_status_view(request):
    if request.user.is_authenticated:
        mobile_number = ''
        bio = ''
        skills = ''
        profile_image = ''
        try:
            if hasattr(request.user, 'profile'):
                mobile_number = request.user.profile.mobile_number
                bio = request.user.profile.bio
                skills = request.user.profile.skills
                profile_image = getattr(request.user.profile, 'profile_image', '') or ''
        except Exception:
            pass
        return JsonResponse({
            'success': True,
            'user': {
                'email': request.user.email,
                'fullName': request.user.first_name,
                'mobileNumber': mobile_number,
                'bio': bio,
                'skills': skills,
                'profile_image': profile_image
            }
        })
    return JsonResponse({'success': False, 'message': 'Not authenticated.'}, status=401)



@csrf_exempt
def logout_view(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Only POST method allowed.'}, status=405)
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully.'})


@csrf_exempt
def profile_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Not authenticated.'}, status=401)
    
    if request.method == 'GET':
        mobile_number = ''
        bio = ''
        skills = ''
        profile_image = ''
        username = ''
        try:
            profile, created = Profile.objects.get_or_create(user=request.user)
            mobile_number = profile.mobile_number or ''
            bio = profile.bio or ''
            skills = profile.skills or ''
            profile_image = getattr(profile, 'profile_image', '') or ''
            
            if not profile.username:
                profile.username = generate_unique_username(request.user.email, request.user.first_name)
                profile.save()
            username = profile.username
        except Exception:
            pass
        badges = []
        try:
            badges_qs = CourseBadge.objects.filter(user=request.user)
            for b in badges_qs:
                badges.append({
                    'course_title': b.course_title,
                    'badge_name': b.badge_name,
                    'earned_at': b.earned_at.strftime('%Y-%m-%d')
                })
        except Exception:
            pass

        return JsonResponse({
            'success': True,
            'profile': {
                'name': request.user.first_name,
                'email': request.user.email,
                'username': username,
                'phone': mobile_number,
                'bio': bio,
                'skills': skills,
                'profile_image': profile_image,
                'badges': badges
            }
        })
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name', '')
            phone = data.get('phone', '')
            bio = data.get('bio', '')
            skills = data.get('skills', '')
            profile_image = data.get('profile_image', '')
            
            # Update User
            user = request.user
            user.first_name = name
            user.save()
            
            # Update Profile
            profile, created = Profile.objects.get_or_create(user=user)
            profile.mobile_number = phone
            profile.bio = bio
            profile.skills = skills
            profile.profile_image = profile_image
            profile.save()
            
            return JsonResponse({'success': True, 'message': 'Profile updated successfully.'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
            
    return JsonResponse({'success': False, 'message': 'Method not allowed.'}, status=405)



@csrf_exempt
def admin_users_view(request):
    if request.method == 'GET':
        users = User.objects.all()
        user_list = []
        for u in users:
            mobile_number = ''
            bio = ''
            skills = ''
            if hasattr(u, 'profile'):
                mobile_number = u.profile.mobile_number
                bio = u.profile.bio
                skills = u.profile.skills
            user_list.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'fullName': u.first_name,
                'mobileNumber': mobile_number,
                'bio': bio,
                'skills': skills,
                'is_superuser': u.is_superuser
            })
        return JsonResponse({'success': True, 'users': user_list})
        
    elif request.method == 'DELETE':
        try:
            user_id = request.GET.get('id')
            if not user_id:
                data = json.loads(request.body)
                user_id = data.get('id')
            
            if user_id:
                user = User.objects.get(id=user_id)
                user.delete()
                return JsonResponse({'success': True, 'message': 'User deleted successfully.'})
            return JsonResponse({'success': False, 'message': 'User ID is required.'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
            
    return JsonResponse({'success': False, 'message': 'Method not allowed.'}, status=405)


@csrf_exempt
def course_videos_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Not authenticated.'}, status=401)
        
    if request.method == 'GET':
        videos = CourseVideo.objects.all().order_by('id')
        video_list = []
        for video in videos:
            progress_entry = VideoProgress.objects.filter(user=request.user, video=video).first()
            last_position = progress_entry.last_position if progress_entry else 0.0
            percentage = progress_entry.percentage if progress_entry else 0
            
            video_list.append({
                'id': video.id,
                'title': video.title,
                'category': video.category,
                'video_url': video.video_url,
                'thumbnail_url': video.thumbnail_url or '',
                'duration': video.duration,
                'last_position': last_position,
                'percentage': percentage,
                'is_enrolled': progress_entry is not None
            })
        return JsonResponse({'success': True, 'videos': video_list})
        
    return JsonResponse({'success': False, 'message': 'Method not allowed.'}, status=405)


@csrf_exempt
def video_progress_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Not authenticated.'}, status=401)
        
    if request.method == 'GET':
        video_id = request.GET.get('videoId')
        if not video_id:
            return JsonResponse({'success': False, 'message': 'Video ID required.'}, status=400)
            
        progress = VideoProgress.objects.filter(user=request.user, video_id=video_id).first()
        return JsonResponse({
            'success': True,
            'last_position': progress.last_position if progress else 0.0,
            'percentage': progress.percentage if progress else 0
        })
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            video_id = data.get('videoId')
            last_position = float(data.get('lastPosition', 0.0))
            percentage = int(data.get('percentage', 0))
            
            if not video_id:
                return JsonResponse({'success': False, 'message': 'Video ID is required.'}, status=400)
                
            video = CourseVideo.objects.get(id=video_id)
            progress, created = VideoProgress.objects.get_or_create(user=request.user, video=video)
            progress.last_position = last_position
            progress.percentage = percentage
            progress.save()
            
            return JsonResponse({'success': True, 'message': 'Progress updated successfully.'})
        except CourseVideo.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Video not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
            
    return JsonResponse({'success': False, 'message': 'Method not allowed.'}, status=405)


@csrf_exempt
def admin_videos_view(request):
    # Quick bypass or auth check; we will check is_staff / is_superuser
    if not request.user.is_authenticated or not (request.user.is_staff or request.user.is_superuser):
        return JsonResponse({'success': False, 'message': 'Admin authorization required.'}, status=403)
        
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            category = data.get('category')
            video_url = data.get('videoUrl')
            thumbnail_url = data.get('thumbnailUrl', '')
            duration = data.get('duration', '00:00')
            
            if not title or not category or not video_url:
                return JsonResponse({'success': False, 'message': 'Title, category, and video URL are required.'}, status=400)
                
            video = CourseVideo.objects.create(
                title=title,
                category=category,
                video_url=video_url,
                thumbnail_url=thumbnail_url,
                duration=duration
            )
            return JsonResponse({'success': True, 'message': 'Video added successfully.', 'video': {
                'id': video.id,
                'title': video.title,
                'category': video.category,
                'video_url': video.video_url,
                'thumbnail_url': video.thumbnail_url or '',
                'duration': video.duration
            }})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
            
    elif request.method == 'DELETE':
        try:
            video_id = request.GET.get('id')
            if not video_id:
                data = json.loads(request.body)
                video_id = data.get('id')
                
            if video_id:
                video = CourseVideo.objects.get(id=video_id)
                video.delete()
                return JsonResponse({'success': True, 'message': 'Video deleted successfully.'})
            return JsonResponse({'success': False, 'message': 'Video ID is required.'}, status=400)
        except CourseVideo.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Video not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
            
    return JsonResponse({'success': False, 'message': 'Method not allowed.'}, status=405)


@csrf_exempt
def add_badge_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Not authenticated.'}, status=401)
        
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            course_title = data.get('course_title')
            badge_name = data.get('badge_name')
            
            if not course_title or not badge_name:
                return JsonResponse({'success': False, 'message': 'course_title and badge_name are required.'}, status=400)
                
            badge, created = CourseBadge.objects.get_or_create(
                user=request.user,
                course_title=course_title,
                defaults={'badge_name': badge_name}
            )
            return JsonResponse({'success': True, 'message': 'Badge recorded successfully.', 'created': created})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
            
    return JsonResponse({'success': False, 'message': 'Method not allowed.'}, status=405)


@csrf_exempt
def search_profile_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Not authenticated.'}, status=401)
        
    if request.method == 'GET':
        username = request.GET.get('username')
        if not username:
            return JsonResponse({'success': False, 'message': 'Username is required.'}, status=400)
            
        try:
            profile = Profile.objects.get(username__iexact=username)
            user = profile.user
            
            # Fetch badges
            badges = []
            try:
                badges_qs = CourseBadge.objects.filter(user=user)
                for b in badges_qs:
                    badges.append({
                        'course_title': b.course_title,
                        'badge_name': b.badge_name,
                        'earned_at': b.earned_at.strftime('%Y-%m-%d')
                    })
            except Exception:
                pass
                
            return JsonResponse({
                'success': True,
                'profile': {
                    'name': user.first_name,
                    'username': profile.username,
                    'phone': profile.mobile_number or '',
                    'bio': profile.bio or '',
                    'skills': profile.skills or '',
                    'profile_image': profile.profile_image or '',
                    'badges': badges
                }
            })
        except Profile.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Profile not found.'}, status=404)
            
    return JsonResponse({'success': False, 'message': 'Method not allowed.'}, status=405)





