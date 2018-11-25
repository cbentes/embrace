using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KeepCamera : MonoBehaviour {

	void Start () {
        // Keep Player object (and its camera) when scene changes
        // New scenes do not have actor, and flow never goes back to main 
        // scene that chreated the camera (to not create it again)
        DontDestroyOnLoad(this.gameObject);
    }
}
