using UnityEngine;

public class ThirdPersonController : MonoBehaviour
{
    public float speed = 5f;
    public float turnSpeed = 10f;
    public Animator anim;

    void Update()
    {
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");

        Vector3 move = new Vector3(h, 0, v).normalized;

        if (move.magnitude > 0.1f)
        {
            anim.SetBool("isWalking", true);

            float targetAngle = Mathf.Atan2(move.x, move.z) * Mathf.Rad2Deg;
            Quaternion rotate = Quaternion.Euler(0, targetAngle, 0);

            transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * turnSpeed);
            transform.Translate(Vector3.forward * speed * Time.deltaTime);
        }
        else
        {
            anim.SetBool("isWalking", false);
        }
    }
}
