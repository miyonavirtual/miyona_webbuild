using UnityEngine;
using UniVRM10; // Updated to UniVRM 1.0!

[RequireComponent(typeof(Animator))]
public class MiyonaEyeContact : MonoBehaviour
{
    [Header("Targeting")]
    [Tooltip("What Miyona should look at (usually the Main Camera)")]
    public Transform lookTarget;

    [Header("Head Tracking Settings")]
    public float lookSpeed = 3.0f;
    [Tooltip("How far behind her the camera can go before she stops looking (in degrees)")]
    public float maxLookAngle = 100f;
    
    [Header("Eye Tracking Settings")]
    [Tooltip("How far the eyeballs shift to look at the camera")]
    public float eyeSensitivity = 3.0f;

    [Header("Blinking Settings")]
    public float minBlinkInterval = 2.0f;
    public float maxBlinkInterval = 6.0f;
    public float blinkDuration = 0.15f;

    private Animator animator;
    private Vrm10Instance vrmInstance; // UniVRM 1.0 component

    private float currentLookWeight = 0f;
    private float targetLookWeight = 0f;
    private float nextBlinkTime;
    private bool isBlinking = false;
    
    [HideInInspector]
    public bool suspendBlinking = false; // Used by EmotionController to stop blinking when eyes are already closed
    
    [HideInInspector]
    public bool suspendHeadTracking = false; // Used by Entrance script to stop her from looking at the camera while walking in

    void Start()
    {
        animator = GetComponent<Animator>();
        vrmInstance = GetComponent<Vrm10Instance>();
        
        // If not assigned, try to grab the main camera
        if (lookTarget == null && Camera.main != null)
        {
            lookTarget = Camera.main.transform;
        }

        ScheduleNextBlink();
    }

    void Update()
    {
        HandleHeadTracking();
        HandleBlinking();
        
        // Since we disabled standard IK eye weight, we must calculate eyeballs manually
        HandleEyeTracking();
    }

    private void HandleHeadTracking()
    {
        if (lookTarget == null || suspendHeadTracking) 
        {
            // If tracking is suspended, smoothly return her head to the center
            targetLookWeight = 0f;
            currentLookWeight = Mathf.Lerp(currentLookWeight, targetLookWeight, Time.deltaTime * lookSpeed);
            return;
        }

        // Calculate the angle between where her body is facing and where the camera is
        Vector3 directionToTarget = lookTarget.position - transform.position;
        directionToTarget.y = 0; // Ignore height difference for the angle calculation
        float angleToTarget = Vector3.Angle(transform.forward, directionToTarget);

        // If the camera is behind her (angle is too large), she stops looking
        if (angleToTarget > maxLookAngle)
        {
            targetLookWeight = 0f;
        }
        else
        {
            targetLookWeight = 1f;
        }

        // Smoothly transition the weight so her head doesn't snap instantly
        currentLookWeight = Mathf.Lerp(currentLookWeight, targetLookWeight, Time.deltaTime * lookSpeed);
    }
    
    private void HandleEyeTracking()
    {
        if (vrmInstance == null || vrmInstance.Runtime == null || lookTarget == null) return;

        Transform head = animator.GetBoneTransform(HumanBodyBones.Head);
        if (head == null) return;

        // Get the direction to the camera, but convert it to "local" space of the head.
        // This tells us if the camera is technically "Left", "Right", "Up", or "Down" from her face.
        Vector3 directionToTarget = (lookTarget.position - head.position).normalized;
        Vector3 directionLocalToHead = head.InverseTransformDirection(directionToTarget);

        // Multiply by currentLookWeight, so if she looks away, her eyes snap to center naturally
        float lookRight = Mathf.Clamp01(directionLocalToHead.x * eyeSensitivity) * currentLookWeight;
        float lookLeft = Mathf.Clamp01(-directionLocalToHead.x * eyeSensitivity) * currentLookWeight;
        float lookUp = Mathf.Clamp01(directionLocalToHead.y * eyeSensitivity) * currentLookWeight;
        float lookDown = Mathf.Clamp01(-directionLocalToHead.y * eyeSensitivity) * currentLookWeight;

        // Force VRM 1.0 Expressions to shift her eyeballs perfectly
        vrmInstance.Runtime.Expression.SetWeight(ExpressionKey.LookRight, lookRight);
        vrmInstance.Runtime.Expression.SetWeight(ExpressionKey.LookLeft, lookLeft);
        vrmInstance.Runtime.Expression.SetWeight(ExpressionKey.LookUp, lookUp);
        vrmInstance.Runtime.Expression.SetWeight(ExpressionKey.LookDown, lookDown);
    }

    private void HandleBlinking()
    {
        if (vrmInstance == null || vrmInstance.Runtime == null) return;

        // Skip blinking if we are suspending it (e.g. happy emotion with closed eyes)
        if (suspendBlinking) return;

        if (!isBlinking && Time.time >= nextBlinkTime)
        {
            StartCoroutine(BlinkSequence());
        }
    }

    private System.Collections.IEnumerator BlinkSequence()
    {
        isBlinking = true;

        // Close eyes using UniVRM 1.0
        vrmInstance.Runtime.Expression.SetWeight(ExpressionKey.Blink, 1f);
        
        yield return new WaitForSeconds(blinkDuration);

        // Open eyes
        vrmInstance.Runtime.Expression.SetWeight(ExpressionKey.Blink, 0f);

        ScheduleNextBlink();
        isBlinking = false;
    }

    private void ScheduleNextBlink()
    {
        nextBlinkTime = Time.time + Random.Range(minBlinkInterval, maxBlinkInterval);
    }

    // This built-in Unity message is called specifically to handle Inverse Kinematics (IK)
    void OnAnimatorIK(int layerIndex)
    {
        if (animator == null || lookTarget == null) return;

        // Get Miyona's head position so she doesn't bend up or down
        Transform headBone = animator.GetBoneTransform(HumanBodyBones.Head);
        float headHeight = headBone != null ? headBone.position.y : transform.position.y + 1.4f;
        
        // Create a flat look position that perfectly matches her head height
        Vector3 levelLookPosition = new Vector3(lookTarget.position.x, headHeight, lookTarget.position.z);

        // Set the IK position to the new level target
        animator.SetLookAtPosition(levelLookPosition);

        // We SET EYE WEIGHT TO 0 HERE because our new HandleEyeTracking() function mathematically does it better!
        animator.SetLookAtWeight(currentLookWeight, 0.2f, 0.8f, 0.0f, 0.5f);
    }
}
