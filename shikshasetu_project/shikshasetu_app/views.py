import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Profile

# Create your views here.

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
        Profile.objects.create(user=user, mobile_number=mobile_number)
        
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
            try:
                if hasattr(user, 'profile'):
                    mobile_number = user.profile.mobile_number
                    bio = user.profile.bio
                    skills = user.profile.skills
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
                    'skills': skills
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
        try:
            if hasattr(request.user, 'profile'):
                mobile_number = request.user.profile.mobile_number
                bio = request.user.profile.bio
                skills = request.user.profile.skills
        except Exception:
            pass
        return JsonResponse({
            'success': True,
            'user': {
                'email': request.user.email,
                'fullName': request.user.first_name,
                'mobileNumber': mobile_number,
                'bio': bio,
                'skills': skills
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
        try:
            if hasattr(request.user, 'profile'):
                mobile_number = request.user.profile.mobile_number
                bio = request.user.profile.bio
                skills = request.user.profile.skills
        except Exception:
            pass
        return JsonResponse({
            'success': True,
            'profile': {
                'name': request.user.first_name,
                'email': request.user.email,
                'phone': mobile_number,
                'bio': bio,
                'skills': skills
            }
        })
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name', '')
            phone = data.get('phone', '')
            bio = data.get('bio', '')
            skills = data.get('skills', '')
            
            # Update User
            user = request.user
            user.first_name = name
            user.save()
            
            # Update Profile
            profile, created = Profile.objects.get_or_create(user=user)
            profile.mobile_number = phone
            profile.bio = bio
            profile.skills = skills
            profile.save()
            
            return JsonResponse({'success': True, 'message': 'Profile updated successfully.'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
            
    return JsonResponse({'success': False, 'message': 'Method not allowed.'}, status=405)

